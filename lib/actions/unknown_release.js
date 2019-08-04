exports.perform = (slack) => perform(slack);

/**
 * slack : outgoing_messengers/slack
 */
const perform = (slack) => {
  return slack.reply("unknown-release", [
    "どれをリリースしたらいいのかわかりません！",
    "リリースする対象が不明です",
    "（・・・・・・何をリリースするんだろう？）",
  ]);
};
