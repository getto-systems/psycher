const slack_secret = require("../../lib/secrets/slack");

/**
 * secret : {
 *   bot_token: slack bot token
 * }
 * struct : {
 *   channel: slack channel
 *   timestamp: event timestamp
 * }
 *
 * returns {
 *   channel,
 *   timestamp,
 *   bot_token,
 * }
 */
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
