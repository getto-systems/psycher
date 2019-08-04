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
        "CHANNEL": { "elm": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" } }
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
    slack: slack_secret.prepare(raw_slack_secret),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret),
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
        "CHANNEL": { "elm": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" } }
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
    slack: slack_secret.prepare(raw_slack_secret),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret),
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
        "CHANNEL": { "elm": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" } }
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
    slack: slack_secret.prepare(raw_slack_secret),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret),
  };

  const bot_event = slack_bot_event.init({
    event_info,
    secret,
  });

  expect(bot_event.is_mention()).toBe(true);
});

test("secrets", () => {
  const raw_slack_secret = {
    bot_token: "SLACK_BOT_TOKEN",
  };
  const raw_gitlab_secret = {
    trigger_tokens: {
      "TEAM": {
        "CHANNEL": { "elm": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" } }
      },
    },
  };
  const event_info = {
    type: "app_mention",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "リリース",
  };
  const secret = {
    slack: slack_secret.prepare(raw_slack_secret),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret),
  };

  const bot_event = slack_bot_event.init({
    event_info,
    secret,
  });

  const slack_secret_value = bot_event.slack_secret();
  const gitlab_secret_value = bot_event.gitlab_secret();

  expect(slack_secret_value.channel).toBe("CHANNEL");
  expect(slack_secret_value.timestamp).toBe("TIMESTAMP");
  expect(slack_secret_value.bot_token).toBe("SLACK_BOT_TOKEN");

  expect(gitlab_secret_value.channel).toBe("CHANNEL");
  expect(gitlab_secret_value.timestamp).toBe("TIMESTAMP");
  expect(gitlab_secret_value.project_id).toBe("ELM_PROJECT_ID");
  expect(gitlab_secret_value.trigger_token).toBe("ELM_TOKEN");
});
