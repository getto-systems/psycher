const slack_bot_event = require("../lib/slack_bot_event");
const psycher_secret = require("../lib/psycher_secret");
const gitlab = require("../lib/outgoing_messengers/gitlab");

const bot_event = slack_bot_event.init({
  type: "app_mention",
  team: "TEAM",
  channel: "CHANNEL",
  timestamp: "TIMESTAMP",
  text: "<@USERID> リリース",
});

const secret = psycher_secret.init({
  slack: {
    bot_token: process.env.SLACK_BOT_TOKEN,
  },
  gitlab: {
    trigger_tokens: {
      "TEAM": {
        "CHANNEL": {
          "slack": {
            project_id: process.env.GITLAB_PROJECT_ID,
            token: process.env.GITLAB_TRIGGER_TOKEN,
          },
        },
      },
    },
  },
});

gitlab.init(bot_event, secret).trigger();
