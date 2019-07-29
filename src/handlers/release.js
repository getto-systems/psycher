exports.handle_event = (bot_event, messenger) => handle_event(bot_event, messenger);

/**
 * bot_event : slack_bot_event
 * messenger : outgoing_messenger
 */
const handle_event = (bot_event, messenger) => {
  if (bot_event.app_mention_includes("リリース")) {
    const promise = messenger.gitlab.trigger();
    if (promise) {
      return Promise.all([
        promise,
        messenger.slack.add_reaction("thumbsup"),
      ]);
    } else {
      return messenger.slack.reply_random([
        "どれをリリースしたらいいのかわかりません！",
        "リリースする対象が不明です",
        "（・・・・・・何をリリースするんだろう？）",
      ]);
    }
  }
};
