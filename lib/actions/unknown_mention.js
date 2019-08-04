exports.perform = (slack) => perform(slack);

/**
 * slack : outgoing_messengers/slack
 */
const perform = (slack) => {
  return slack.reply("unknown-mention", [
    "は？",
    "何言ってるの？",
    "・・・・・・・・・・・・？",
  ]);
};
