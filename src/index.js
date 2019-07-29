const slack_bot_event = require("./slack_bot_event");
const psycher_secret = require("./psycher_secret");
const outgoing_messenger = require("./outgoing_messenger");
const handler = require("./handler");

const aws_secret = require("./aws/secret");

exports.handler = async (aws_lambda_event) => {
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

  // there is no event when challenge request
  const raw_event = body.event;
  if (raw_event) {
    const bot_event = slack_bot_event.init({
      type: raw_event.type,
      channel: raw_event.channel,
      timestamp: raw_event.ts,
      text: raw_event.text,
    });

    const secret = await get_secret({
      region: process.env.REGION,
      secret_id: process.env.SECRET_ID,
    });
    const messenger = outgoing_messenger.init(bot_event, secret);

    await handler.handle_event(bot_event, messenger);
  }

  // response to challenge request
  return {
    statusCode: 200,
    body: JSON.stringify({
      challenge: body.challenge,
    }),
  };
};

const get_secret = async (env) => {
  const secret = await aws_secret.get(env);

  return psycher_secret.init({
    slack: {
      bot_token: secret["slack-bot-token"],
    },
    gitlab: {
      user_id: secret["gitlab-user-id"],
      release_targets: parse_object(secret["gitlab-release-targets"]),
      trigger_tokens: parse_object(secret["gitlab-trigger-tokens"]),
    },
  });
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
