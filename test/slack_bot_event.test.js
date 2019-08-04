const slack_bot_event = require("../lib/slack_bot_event");

const slack_secret = require("../lib/secrets/slack");
const gitlab_secret = require("../lib/secrets/gitlab");

test("is_release", () => {
  const raw_slack_secret = {
    bot_token: "SLACK_BOT_TOKEN",
  };
  const raw_gitlab_secret = {
    trigger_tokens: {
      "TEAM": {
        "CHANNEL": { "elm": { project: "ELM_PROJECT_ID", token: "ELM_TOKEN" } }
      },
    },
  };
  const event_info = {
    type: "app_mention",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "リリース elm",
  };
  const secret = {
    slack: slack_secret.prepare(raw_slack_secret).init(event_info),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret).init(event_info),
  };

  const bot_event = slack_bot_event.init({
    event_info,
    secret,
  });

  expect(bot_event.is_release()).toBe(true);
});

test("is_greeting", () => {
  const raw_slack_secret = {
    bot_token: "SLACK_BOT_TOKEN",
  };
  const raw_gitlab_secret = {
    trigger_tokens: {
      "TEAM": {
        "CHANNEL": { "elm": { project: "ELM_PROJECT_ID", token: "ELM_TOKEN" } }
      },
    },
  };
  const event_info = {
    type: "app_mention",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "よろ",
  };
  const secret = {
    slack: slack_secret.prepare(raw_slack_secret).init(event_info),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret).init(event_info),
  };

  const bot_event = slack_bot_event.init({
    event_info,
    secret,
  });

  expect(bot_event.is_greeting()).toBe(true);
});

test("is_mention", () => {
  const raw_slack_secret = {
    bot_token: "SLACK_BOT_TOKEN",
  };
  const raw_gitlab_secret = {
    trigger_tokens: {
      "TEAM": {
        "CHANNEL": { "elm": { project: "ELM_PROJECT_ID", token: "ELM_TOKEN" } }
      },
    },
  };
  const event_info = {
    type: "app_mention",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "よろ",
  };
  const secret = {
    slack: slack_secret.prepare(raw_slack_secret).init(event_info),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret).init(event_info),
  };

  const bot_event = slack_bot_event.init({
    event_info,
    secret,
  });

  expect(bot_event.is_mention()).toBe(true);
});
