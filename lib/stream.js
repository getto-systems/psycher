exports.init = (struct) => init(struct);

/**
 * struct : {
 *   secret_store : infra/secret_store
 *   message_store : infra/message_store
 * }
 *
 * returns {
 *   post: async (message) => post message
 *   add: async (reaction) => add reaction
 * }
 */
const init = ({secret_store, message_store}) => {
  /**
   * message : reply/message
   */
  const post = async ({channel, text}) => {
    const token = await secret_store.message_token();

    return message_store.post({
      token,
      channel,
      text,
    });
  };

  /**
   * reaction : reply/reaction
   */
  const add = async ({channel, timestamp, name}) => {
    const token = await secret_store.message_token();

    return message_store.add({
      token,
      channel,
      timestamp,
      name,
    });
  };

  return {
    post,
    add,
  };
};
