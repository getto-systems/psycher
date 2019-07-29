const outgoing_messenger = require("../outgoing_messenger.js");

const slack_bot_event = require("../../src/slack_bot_event.js");
const greeting = require("../../src/handlers/unknown_mention.js");

test("unknown mention", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "<@USERID> おもしろいこと言って",
  });

  const promise = greeting.handle_event(bot_event, messenger);
  await promise;

  expect(messenger.data.slack).toBe(1);
  expect(!!promise).toBe(true);
});

test("unknown message", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "message.channels",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "hello",
  });

  const promise = greeting.handle_event(bot_event, messenger);
  await promise;

  expect(messenger.data.slack).toBe(0);
  expect(!!promise).toBe(false);
});
