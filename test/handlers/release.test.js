const outgoing_messenger = require("../outgoing_messenger.js");

const slack_bot_event = require("../../src/slack_bot_event.js");
const greeting = require("../../src/handlers/release.js");

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

  expect(messenger.data.slack).toBe(1);
  expect(messenger.data.gitlab).toBe(1);
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

  expect(messenger.data.slack).toBe(0);
  expect(messenger.data.gitlab).toBe(0);
  expect(!!promise).toBe(false);
});
