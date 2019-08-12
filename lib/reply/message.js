exports.random = (struct) => random(struct);

/**
 * struct : {
 *   conversation: conversation
 *   messages: message list
 * }
 */
const random = ({channel, messages}) => {
  const text = sample(messages);

  return {
    channel,
    text,
  };
};

const sample = (messages) => {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
};
