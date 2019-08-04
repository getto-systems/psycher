const slack_messenger = require("../lib/outgoing_messengers/slack");
const gitlab_messenger = require("../lib/outgoing_messengers/gitlab");

const slack_request = require("./outgoing_messengers/requests/slack");
const gitlab_request = require("./outgoing_messengers/requests/gitlab");

const slack_secret = require("../lib/secrets/slack");
const gitlab_secret = require("../lib/secrets/gitlab");

const slack_bot_event = require("../lib/slack_bot_event");
const handler = require("../lib/handler");

test("handle release mention", async () => {
  const mock = init_mock();

  await init_handler(mock, {
    type: "app_mention",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "リリース elm",
  }).handle_event();

  expect(mock.slack.data.reply.length).toBe(0);
  expect(mock.slack.data.reaction.length).toBe(1);
  expect(mock.slack.data.reaction[0]).toBe("release-triggered");

  expect(mock.gitlab.data.trigger.length).toBe(1);
  expect(mock.gitlab.data.trigger[0]).toBe("release");
});

test("handle unknown release mention", async () => {
  const mock = init_mock();

  await init_handler(mock, {
    type: "app_mention",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "リリース",
  }).handle_event();

  expect(mock.slack.data.reply.length).toBe(1);
  expect(mock.slack.data.reply[0]).toBe("unknown-release");
  expect(mock.slack.data.reaction.length).toBe(0);

  expect(mock.gitlab.data.trigger.length).toBe(0);
});

test("handle greeting mention", async () => {
  const mock = init_mock();

  await init_handler(mock, {
    type: "app_mention",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "よろ",
  }).handle_event();

  expect(mock.slack.data.reply.length).toBe(1);
  expect(mock.slack.data.reply[0]).toBe("greeting");
  expect(mock.slack.data.reaction.length).toBe(0);

  expect(mock.gitlab.data.trigger.length).toBe(0);
});

test("handle unknown mention", async () => {
  const mock = init_mock();

  await init_handler(mock, {
    type: "app_mention",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "何か面白いこと言って",
  }).handle_event();

  expect(mock.slack.data.reply.length).toBe(1);
  expect(mock.slack.data.reply[0]).toBe("unknown-mention");
  expect(mock.slack.data.reaction.length).toBe(0);

  expect(mock.gitlab.data.trigger.length).toBe(0);
});

test("unknown event", async () => {
  const mock = init_mock();

  await init_handler(mock, {
    type: "unknown_event",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "TEXT",
  }).handle_event();

  expect(mock.slack.data.reply.length).toBe(0);
  expect(mock.slack.data.reaction.length).toBe(0);

  expect(mock.gitlab.data.trigger.length).toBe(0);
});

const init_handler = (mock, event_info) => {
  const raw_slack_secret = {
    bot_token: "SLACK_BOT_TOKEN",
  };
  const raw_gitlab_secret = {
    trigger_tokens: {
      "TEAM": {
        "CHANNEL": {
          "elm": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" },
          "rails": { project_id: "RAILS_PROJECT_ID", token: "RAILS_TOKEN" },
        }
      },
    },
  };
  const secret = {
    slack: slack_secret.prepare(raw_slack_secret),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret),
  };

  const bot_event = slack_bot_event.init({
    event_info,
    secret,
  });

  const messenger = {
    slack: slack_messenger.prepare(mock.slack),
    gitlab: gitlab_messenger.prepare(mock.gitlab),
  };

  return handler.init({bot_event, messenger});
};

const init_mock = () => {
  const slack = slack_request.init();
  const gitlab = gitlab_request.init();

  return {
    slack,
    gitlab,
  };
};
