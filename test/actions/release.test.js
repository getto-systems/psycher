const slack_messenger = require("../../lib/outgoing_messengers/slack");
const gitlab_messenger = require("../../lib/outgoing_messengers/gitlab");

const slack_request = require("../outgoing_messengers/requests/slack");
const gitlab_request = require("../outgoing_messengers/requests/gitlab");

const release = require("../../lib/actions/release");

test("release", async () => {
  const slack_request_mock = slack_request.init();
  const gitlab_request_mock = gitlab_request.init();

  const slack = slack_messenger.prepare(slack_request_mock).init({
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    bot_token: "SLACK_BOT_TOKEN",
  });
  const gitlab = gitlab_messenger.prepare(gitlab_request_mock).init({
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    project_id: "PROJECT_ID",
    trigger_token: "TRIGGER_TOKEN",
  });

  release.perform(slack, gitlab);

  expect(slack_request_mock.data.reply.length).toBe(0);
  expect(slack_request_mock.data.reaction.length).toBe(1);
  expect(slack_request_mock.data.reaction[0]).toBe("release-triggered");

  expect(gitlab_request_mock.data.trigger.length).toBe(1);
  expect(gitlab_request_mock.data.trigger[0]).toBe("release");
});
