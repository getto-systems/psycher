exports.init = (struct) => init(struct);

/**
 * struct : {
 *   slack_api: vendor/slack_api
 * }
 *
 * returns {
 *   post : async (struct) => post message
 *   add : async (struct) => add reaction
 * }
 */
const init = ({slack_api}) => {
  /**
   * struct : {
   *   token: slack bot token
   *   reply_to: conversation.reply_to()
   *   text : message text
   * }
   */
  const post = async ({token, reply_to: {channel}, text}) => {
    const response = await slack_api.chat.postMessage({
      token,
      channel,
      text,
    });
    console.log(response.status);
  };

  /**
   * struct : {
   *   token: slack bot token
   *   reply_to: conversation.reply_to()
   *   name : reaction name
   * }
   */
  const add = async ({token, reply_to: {channel, timestamp}, name}) => {
    const response = await slack_api.reactions.add({
      token,
      channel,
      timestamp,
      name,
    });
    console.log(response.status);
  };

  return {
    post,
    add,
  };
};
