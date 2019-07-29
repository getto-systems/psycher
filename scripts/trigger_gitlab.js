const slack_bot_event = require("../lib/slack_bot_event");
const psycher_secret = require("../lib/psycher_secret");
const gitlab = require("../lib/outgoing_messengers/gitlab");

const bot_event = slack_bot_event.init({
  type: "app_mention",
  channel: "CHANNEL",
  timestamp: "TIMESTAMP",
  text: "<@USERID> リリース",
});

const secret = psycher_secret.init({
  slack: {
    bot_token: process.env.SLACK_BOT_TOKEN,
  },
  gitlab: {
    user_id: process.env.GITLAB_USER_ID,
    release_targets: { "CHANNEL": "slack" },
    trigger_tokens: { "CHANNEL": { "slack": process.env.GITLAB_TRIGGER_TOKEN } },
  },
});

gitlab.init(bot_event, secret).trigger();
