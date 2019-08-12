const handler = require("./lib/handler");
const slack_bot_event = require("./lib/slack_bot_event");

const repository = {
  stream: require("./lib/stream"),
  pipeline: require("./lib/pipeline"),
  conversation: {
    session: require("./lib/conversation/session"),
    deployment: require("./lib/conversation/deployment"),
  },
};

const infra = {
  document_store: require("./lib/infra/document_store"),
  secret_store: require("./lib/infra/secret_store"),

  message_store: require("./lib/infra/message_store"),
  job_store: require("./lib/infra/job_store"),
};

const vendor = {
  aws_dynamodb: require("./vendor/aws_dynamodb"),
  aws_secrets: require("./vendor/aws_secrets"),

  slack_api: require("./vendor/slack_api"),
  gitlab_api: require("./vendor/gitlab_api"),
};

const i18n_factory = require("./lib/i18n");

exports.handler = async (aws_lambda_event) => {
  // logging event object for debug real-world event
  console.log(aws_lambda_event);

  const body = parse_json(aws_lambda_event.body);
  if (!body) {
    // bad request when request body parse failed
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "invalid_body",
      })
    };
  }

  // there is no event on challenge-request
  const raw_event = body.event;
  if (raw_event) {
    await handle_event(raw_event);
  }

  // response to challenge-request
  return {
    statusCode: 200,
    body: JSON.stringify({
      challenge: body.challenge,
    }),
  };
};

const handle_event = async (raw_event) => {
  const document_store = infra.document_store.init({
    aws_dynamodb: vendor.aws_dynamodb.init({
      region: process.env.REGION,
    }),
  });
  const secret_store = infra.secret_store.init({
    aws_secrets: vendor.aws_secrets.init({
      region: process.env.REGION,
      secret_id: process.env.SECRET_ID,
    }),
  });

  const message_store = infra.message_store.init({
    slack_api: vendor.slack_api.init(),
  });
  const job_store = infra.job_store.init({
    gitlab_api: vendor.gitlab_api.init(),
  });

  const i18n = i18n_factory.init("ja");

  const conversation = slack_bot_event.parse({
    raw_event,
    repository: {
      session: repository.conversation.session.init({
        document_store,
      }),
      deployment: repository.conversation.deployment.init({
        secret_store,
      }),
    },
    i18n,
  });

  const action = await handler.detect_action({
    conversation,
    repository: {
      stream: repository.stream.init({
        secret_store,
        message_store,
      }),
      pipeline: repository.pipeline.init({
        secret_store,
        job_store,
      }),
    },
    i18n,
  });

  await action.perform();
};

const parse_json = (raw) => {
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      // ignore parse error
    }
  }
};
