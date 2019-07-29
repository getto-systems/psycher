const outgoing_messenger = require("./outgoing_messenger");

const slack_bot_event = require("../src/slack_bot_event");
const handler = require("../src/handler");

test("handle greeting", async () => {
  const messenger = outgoing_messenger.init();
  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "<@USERID> よろしく",
  });

  await handler.init(bot_event, messenger).handle_event();

  expect(messenger.data).toBe({ slack: 1, gitlab: 0 });
});
