const slack_bot_event = require("../src/slack_bot_event.js");

test("app_mention", () => {
  const bot_event = slack_bot_event.init({
    type: "app_mention",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "TEXT",
  });

  expect(bot_event.channel).toBe("CHANNEL");
  expect(bot_event.timestamp).toBe("TIMESTAMP");
  expect(bot_event.is_app_mention).toBe(true);
  expect(bot_event.app_mention_includes("EX")).toBe(true);
});

test("message.channels", () => {
  const bot_event = slack_bot_event.init({
    type: "message.channels",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "TEXT",
  });

  expect(bot_event.is_app_mention).toBe(false);
  expect(bot_event.app_mention_includes("EX")).toBe(false);
});
