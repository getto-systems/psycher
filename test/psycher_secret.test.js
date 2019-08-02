const slack_bot_event = require("../lib/slack_bot_event");
const psycher_secret = require("../lib/psycher_secret");

test("properties", () => {
  const secret = psycher_secret.init({
    slack: {
      bot_token: "SLACK_BOT_TOKEN",
    },
    gitlab: {
      trigger_tokens: {},
    },
  });

  expect(secret.slack.bot_token).toBe("SLACK_BOT_TOKEN");
});

test("find elm token", () => {
  const secret = psycher_secret.init({
    slack: {
      bot_token: "",
    },
    gitlab: {
      trigger_tokens: {
        "TEAM": {
          "CHANNEL": { "elm": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" } }
        }
      },
    },
  });

  const bot_event = slack_bot_event.init({
    type: "app_mention",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "elm",
  });

  expect(secret.gitlab.find_token(bot_event).project_id).toBe("ELM_PROJECT_ID");
  expect(secret.gitlab.find_token(bot_event).token).toBe("ELM_TOKEN");
});

test("find token failed", () => {
  const secret = psycher_secret.init({
    slack: {
      bot_token: "",
    },
    gitlab: {
      trigger_tokens: {
        "TEAM": {
          "CHANNEL": { "elm": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" } }
        }
      },
    },
  });

  const bot_event = slack_bot_event.init({
    type: "app_mention",
    team: "UNKNOWN-TEAM",
    channel: "UNKNOWN-CHANNEL",
    timestamp: "TIMESTAMP",
    text: "elm",
  });

  expect(secret.gitlab.find_token(bot_event)).toBe(null);
});
