const outgoing_messenger = require("./outgoing_messenger");

const slack_bot_event = require("../lib/slack_bot_event");
const handler = require("../lib/handler");

test("handle release mention", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "<@USERID> リリース",
  });

  await handler.init(bot_event, messenger).handle_event();

  expect(messenger.data.slack.message.length).toBe(0);
  expect(messenger.data.slack.reaction[0]).toBe("release-triggered");
  expect(messenger.data.gitlab[0]).toBe("release");
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

  expect(messenger.data.slack.message[0]).toBe("greeting");
  expect(messenger.data.slack.reaction.length).toBe(0);
  expect(messenger.data.gitlab.length).toBe(0);
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

  expect(messenger.data.slack.message[0]).toBe("unknown-mention");
  expect(messenger.data.slack.reaction.length).toBe(0);
  expect(messenger.data.gitlab.length).toBe(0);
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

  expect(messenger.data.slack.message.length).toBe(0);
  expect(messenger.data.slack.reaction.length).toBe(0);
  expect(messenger.data.gitlab.length).toBe(0);
});
