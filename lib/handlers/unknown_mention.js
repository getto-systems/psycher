exports.handle_event = (bot_event, messenger) => handle_event(bot_event, messenger);

/**
 * bot_event : slack_bot_event
 * messenger : outgoing_messenger
 */
const handle_event = (bot_event, messenger) => {
  if (bot_event.is_app_mention) {
    return messenger.slack.reply_random("unknown-mention", [
      "は？",
      "何言ってるの？",
      "・・・・・・・・・・・・？",
    ]);
  }
};
