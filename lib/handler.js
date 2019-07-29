const handlers = [
  require("./handlers/release"),
  require("./handlers/greeting"),
  require("./handlers/unknown_mention"),
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
    }, null);
  };

  return {
    handle_event: handle_event,
  };
};
