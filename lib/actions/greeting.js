exports.perform = (slack) => perform(slack);

/**
 * slack : outgoing_messengers/slack
 */
const perform = (slack) => {
  return slack.reply("greeting", [
    "よろしくお願いいたします",
    "おっすおっす",
    "よろしくね！",
  ]);
};
