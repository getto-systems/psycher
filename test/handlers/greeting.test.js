const outgoing_messenger = require("../outgoing_messenger.js");

const slack_bot_event = require("../../src/slack_bot_event.js");
const greeting = require("../../src/handlers/greeting.js");

test("greeting", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "<@USERID> よろしく",
  });

  const promise = greeting.handle_event(bot_event, messenger);
  await promise;

  expect(messenger.data.slack).toBe(1);
  expect(!!promise).toBe(true);
});

test("unknown", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "<@USERID> hello",
  });

  const promise = greeting.handle_event(bot_event, messenger);
  await promise;

  expect(messenger.data.slack).toBe(0);
  expect(!!promise).toBe(false);
});
