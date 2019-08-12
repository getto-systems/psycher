const message = require("../reply/message");

exports.init = (struct) => init(struct);

/**
 * struct : see handler
 */
const init = ({conversation, repository: {stream}, i18n}) => {
  const perform = () => {
    const {channel} = conversation;

    return stream.post(message.random({
      channel,
      messages: i18n.action.unknown_mention.messages,
    }));
  };

  return {
    perform,
  };
};
