exports.init = (struct) => init(struct);

/**
 * struct : {
 *   secret_store : infra/secret_store
 *   message_store : infra/message_store
 * }
 *
 * returns {
 *   post: async ({reply_to, text}) => post message
 *   add: async (reply_to, name) => add reaction
 * }
 */
const init = ({secret_store, message_store}) => {
  /**
   * struct : {
   *   reply_to: conversation.reply_to()
   *   text: message text
   * }
   */
  const post = async ({reply_to, text}) => {
    const token = await secret_store.message_token();

    return message_store.post({
      token,
      reply_to,
      text,
    });
  };

  /**
   * struct : {
   *   reply_to: conversation.reply_to()
   *   name: reaction name
   * }
   */
  const add = async ({reply_to, name}) => {
    const token = await secret_store.message_token();

    return message_store.add({
      token,
      reply_to,
      name,
    });
  };

  return {
    post,
    add,
  };
};
