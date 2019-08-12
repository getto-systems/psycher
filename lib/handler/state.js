exports.init = (struct) => init(struct);

/**
 * struct : {
 *   conversation : conversation
 *   words : i18n.conversation.words
 * }
 */
const init = ({conversation, words}) => {
  const is_already_started = () => {
    return conversation.is_already_started();
  };

  const is_deploy_target_detected = async () => {
    return is_deploying() && (await conversation.is_deploy_target_detected());
  };

  const is_deploying = () => {
    return is_mention() && words.deploy.some(conversation.includes);
  };

  const is_greeting = () => {
    return is_mention() && words.greeting.some(conversation.includes);
  };

  const is_mention = () => {
    return conversation.is_mention();
  };

  return {
    is_already_started,
    is_deploy_target_detected,
    is_deploying,
    is_greeting,
    is_mention,
  };
};
