const slack = require("../lib/outgoing_messengers/requests/slack");

const secret = {
  channel: "CHANNEL",
  timestamp: "TIMESTAMP",
  bot_token: process.env.SLACK_BOT_TOKEN,
};

slack.reply("greeting", secret, "よろしくお願いいたします");
