exports.init = (struct) => init(struct);

/**
 * struct : {
 *   reply_to : conversation.reply_to
 *   repository: {
 *     stream
 *   }
 * }
 *
 * returns {
 *   reply : (messages) => post message
 *   reaction : (name) => add reaction
 * }
 */
const init = ({reply_to, repository: {stream}}) => {
  /**
   * messages : message texts
   */
  const reply = (messages) => {
    return stream.post({
      reply_to,
      text: sample(messages),
    });
  };

  /**
   * name : reaction name
   */
  const reaction = (name) => {
    return stream.add({
      reply_to,
      name,
    });
  };

  return {
    reply,
    reaction,
  };
};

const sample = (messages) => {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
};
