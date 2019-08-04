const slack_secret = require("../../lib/secrets/slack");

test("properties", () => {
  const raw_secret = {
    bot_token: "SLACK_BOT_TOKEN",
  };
  const secret = slack_secret.prepare(raw_secret).init({
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  });

  expect(secret.channel).toBe("CHANNEL");
  expect(secret.timestamp).toBe("TIMESTAMP");
  expect(secret.bot_token).toBe("SLACK_BOT_TOKEN");
});
