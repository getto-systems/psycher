const handler = require("./lib/handler");
const slack_bot_event = require("./lib/slack_bot_event");

const slack_secret = require("./lib/secrets/slack");
const gitlab_secret = require("./lib/secrets/gitlab");

const slack_messenger = require("./lib/outgoing_messengers/slack");
const gitlab_messenger = require("./lib/outgoing_messengers/gitlab");

const slack_request = require("./lib/outgoing_messengers/requests/slack");
const gitlab_request = require("./lib/outgoing_messengers/requests/gitlab");

const aws_secret_provider = require("./lib/providers/aws_secret");

exports.handler = async (aws_lambda_event) => {
  // logging event object for debug real-world slack event
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
    const aws_secret = await aws_secret_provider.get({
      region: process.env.REGION,
      secret_id: process.env.SECRET_ID,
    });
    await init_handler(raw_event, aws_secret).handle_event();
  }

  // response to challenge-request
  return {
    statusCode: 200,
    body: JSON.stringify({
      challenge: body.challenge,
    }),
  };
};

const init_handler = (raw_event, aws_secret) => {
  const event_info = init_event_info(raw_event);
  const secret = init_secret(aws_secret);

  const bot_event = slack_bot_event.init({
    event_info,
    secret,
  });

  const messenger = init_messenger();

  return handler.init({
    bot_event,
    messenger,
  });
};

const init_event_info = (raw_event) => {
  return {
    type: raw_event.type,
    team: raw_event.team,
    channel: raw_event.channel,
    timestamp: raw_event.ts,
    text: raw_event.text,
  };
};

const init_secret = (aws_secret) => {
  const slack = slack_secret.prepare({
    bot_token: aws_secret["slack-bot-token"],
  });
  const gitlab = gitlab_secret.prepare({
    trigger_tokens: parse_object(aws_secret["gitlab-trigger-tokens"]),
  });

  return {
    slack,
    gitlab,
  };
};

const init_messenger = () => {
  const slack = slack_messenger.prepare(slack_request);
  const gitlab = gitlab_messenger.prepare(gitlab_request);

  return {
    slack,
    gitlab,
  };
};

const parse_object = (raw) => {
  const value = parse_json(raw);
  if (!value) {
    return {};
  }
  return value;
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
