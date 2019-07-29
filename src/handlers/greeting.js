exports.handle_event = (bot_event, messenger) => handle_event(bot_event, messenger);

/**
 * bot_event : slack_bot_event
 * messenger : outgoing_messenger
 */
const handle_event = (bot_event, messenger) => {
  if (bot_event.app_mention_includes("よろ")) {
    return messenger.slack.reply("よろしくお願いいたします");
  }
};
