const outgoing_messenger = require("../outgoing_messenger");

const slack_bot_event = require("../../lib/slack_bot_event");
const greeting = require("../../lib/handlers/release");

test("release mention", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "<@USERID> リリース",
  });

  const promise = greeting.handle_event(bot_event, messenger);
  await promise;

  expect(messenger.data.slack.message.length).toBe(0);
  expect(messenger.data.slack.reaction[0]).toBe("release-triggered");
  expect(messenger.data.gitlab[0]).toBe("release");
  expect(!!promise).toBe(true);
});

test("release target not found", async () => {
  const messenger = outgoing_messenger.init();
  messenger.gitlab.trigger = messenger.gitlab.null_trigger;

  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "<@USERID> リリース",
  });

  const promise = greeting.handle_event(bot_event, messenger);
  await promise;

  expect(messenger.data.slack.message[0]).toBe("release-target-not-found");
  expect(messenger.data.slack.reaction.length).toBe(0);
  expect(messenger.data.gitlab[0]).toBe("release");
  expect(!!promise).toBe(true);
});

test("release message", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "message.channels",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "リリース",
  });

  const promise = greeting.handle_event(bot_event, messenger);
  await promise;

  expect(messenger.data.slack.message.length).toBe(0);
  expect(messenger.data.slack.reaction.length).toBe(0);
  expect(messenger.data.gitlab.length).toBe(0);
  expect(!!promise).toBe(false);
});
