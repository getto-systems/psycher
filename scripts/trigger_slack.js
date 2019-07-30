const slack_bot_event = require("../lib/slack_bot_event");
const psycher_secret = require("../lib/psycher_secret");
const slack = require("../lib/outgoing_messengers/slack");

const bot_event = slack_bot_event.init({
  type: "app_mention",
  channel: "CHANNEL",
  timestamp: "TIMESTAMP",
  text: "<@USERID> よろ",
});

const secret = psycher_secret.init({
  slack: {
    bot_token: process.env.SLACK_BOT_TOKEN,
  },
  gitlab: {
    release_targets: {},
    trigger_tokens: {},
  },
});

slack.init(bot_event, secret).reply("よろしくお願いいたします");
