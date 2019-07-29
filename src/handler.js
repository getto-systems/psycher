const handlers = [
  require("./handlers/release.js"),
  require("./handlers/greeting.js"),
  require("./handlers/unknown_mention.js"),
];

exports.init = (bot_event, messenger) => handle_event(bot_event, messenger);

/**
 * bot_event : slack_bot_event
 * messenger : outgoing_messenger
 */
const handle_event = (bot_event, messenger) => {
  return handlers.reduce(null, (promise, handler) => {
    if (promise) {
      return promise;
    }
    return handler.handle_event(bot_event, messenger);
  });
};
