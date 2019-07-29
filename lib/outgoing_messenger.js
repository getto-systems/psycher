const slack = require("./outgoing_messengers/slack");
const gitlab = require("./outgoing_messengers/gitlab");

exports.init = (bot_event, secret) => init(bot_event, secret);

/**
 * bot_event : slack_bot_event
 * secret : psycher_secret
 */
const init = (bot_event, secret) => {
  return {
    slack: slack.init(bot_event, secret),
    gitlab: gitlab.init(bot_event, secret),
  };
};
