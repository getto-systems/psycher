exports.init = (struct) => init(struct);

/**
 * struct : {
 *   stream
 * }
 *
 * returns {
 *   message : ({reply_to, messages}) => message
 *   reaction : ({reply_to, name}) => reaction
 * }
 */
const init = ({stream}) => {
  /**
   * returns {
   *   post : () => post message
   * }
   */
  const message = ({reply_to, messages}) => {
    const post = () => {
      return stream.post({
        reply_to,
        text: sample(messages),
      });
    };

    return {
      post,
    };
  };

  /**
   * returns {
   *   post : () => post message
   * }
   */
  const reaction = ({reply_to, name}) => {
    const add = () => {
      return stream.add({
        reply_to,
        name,
      });
    };

    return {
      add,
    };
  };

  return {
    message,
    reaction,
  };
};

const sample = (messages) => {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
};
