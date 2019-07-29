const slack_bot_event = require("./lib/slack_bot_event");
const psycher_secret = require("./lib/psycher_secret");
const outgoing_messenger = require("./lib/outgoing_messenger");
const handler = require("./lib/handler");

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
  const bot_event = slack_bot_event.init({
    type: raw_event.type,
    channel: raw_event.channel,
    timestamp: raw_event.ts,
    text: raw_event.text,
  });

  const secret = psycher_secret.init({
    slack: {
      bot_token: aws_secret["slack-bot-token"],
    },
    gitlab: {
      user_id: aws_secret["gitlab-user-id"],
      release_targets: parse_object(aws_secret["gitlab-release-targets"]),
      trigger_tokens: parse_object(aws_secret["gitlab-trigger-tokens"]),
    },
  });

  const messenger = outgoing_messenger.init(bot_event, secret);

  return handler.init(bot_event, messenger);
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
