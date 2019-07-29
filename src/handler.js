const handlers = [
  require("./handlers/release.js"),
  require("./handlers/greeting.js"),
  require("./handlers/unknown_mention.js"),
];

exports.init = (bot_event, messenger) => init(bot_event, messenger);

/**
 * bot_event : slack_bot_event
 * messenger : outgoing_messenger
 */
const init = (bot_event, messenger) => {
  const handle_event = () => {
    return handlers.reduce((promise, handler) => {
      if (promise) {
        return promise;
      }
      return handler.handle_event(bot_event, messenger);
    });
  };

  return {
    handle_event: handle_event,
  };
};
