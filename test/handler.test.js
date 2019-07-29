const outgoing_messenger = require("./outgoing_messenger");

const slack_bot_event = require("../src/slack_bot_event");
const handler = require("../src/handler");

test("handle release mention", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "<@USERID> リリース",
  });

  await handler.init(bot_event, messenger).handle_event();

  expect(messenger.data.slack).toBe(1);
  expect(messenger.data.gitlab).toBe(1);
});

test("handle greeting mention", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "<@USERID> よろしく",
  });

  await handler.init(bot_event, messenger).handle_event();

  expect(messenger.data.slack).toBe(1);
  expect(messenger.data.gitlab).toBe(0);
});

test("handle unknown mention", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "<@USERID> hello",
  });

  await handler.init(bot_event, messenger).handle_event();

  expect(messenger.data.slack).toBe(1);
  expect(messenger.data.gitlab).toBe(0);
});

test("handle message", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "message.channels",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "hello",
  });

  await handler.init(bot_event, messenger).handle_event();

  expect(messenger.data.slack).toBe(0);
  expect(messenger.data.gitlab).toBe(0);
});
