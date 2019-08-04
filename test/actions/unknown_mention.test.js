const slack_messenger = require("../../lib/outgoing_messengers/slack");
const slack_request = require("../outgoing_messengers/requests/slack");

const unknown_mention = require("../../lib/actions/unknown_mention");

test("unknown_mention", async () => {
  const slack_request_mock = slack_request.init();
  const slack = slack_messenger.prepare(slack_request_mock).init({
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    bot_token: "SLACK_BOT_TOKEN",
  });

  unknown_mention.perform(slack);

  expect(slack_request_mock.data.reply.length).toBe(1);
  expect(slack_request_mock.data.reply[0]).toBe("unknown-mention");
  expect(slack_request_mock.data.reaction.length).toBe(0);
});
