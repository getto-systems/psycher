const slack_bot_event = require("./lib/slack_bot_event");
const conversation_factory = require("./lib/conversation");

const handler = require("./lib/handler");

const repository = {
  session: require("./lib/session"),
  deployment: require("./lib/deployment"),

  stream: require("./lib/stream"),
  pipeline: require("./lib/pipeline"),
};

const infra = {
  document_store: require("./lib/infra/document_store"),
  secret_store: require("./lib/infra/secret_store"),

  message_store: require("./lib/infra/message_store"),
  job_store: require("./lib/infra/job_store"),
};

const vendor = {
  aws_dynamodb: require("getto-aws_dynamodb"),
  aws_secrets: require("getto-aws_secrets"),

  slack_api: require("getto-slack_api"),
  gitlab_api: require("getto-gitlab_api"),
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

  const event_info = slack_bot_event.parse(body);
  if (event_info) {
    // there is no conversation event in challenge-request
    await handle(event_info);
  };

  // response to challenge-request
  return {
    statusCode: 200,
    body: JSON.stringify({
      challenge: body.challenge,
    }),
  };
};

const handle = (event_info) => {
  const conversation = conversation_factory.init({
    event_info,
    repository: init_repository(),
  });
  const i18n = i18n_factory.init("ja");

  const event_type = event_info.type;

  return handler.init(event_type).operate({
    conversation,
    i18n[event_type],
  });
};

const init_repository = () => {
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

  const session = repository.session.init({
    document_store,
  });
  const deployment = repository.deployment.init({
    secret_store,
  });

  const stream = repository.stream.init({
    secret_store,
    message_store,
  });
  const pipeline = repository.pipeline.init({
    secret_store,
    job_store,
  });

  return {
    session,
    deployment,
    stream,
    pipeline,
  };
};

const parse_json = (raw) => {
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      // ignore parse error
    }
  }
  return null;
};
