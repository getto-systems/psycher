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
    return words.deploy.some(conversation.includes);
  };

  const is_greeting = () => {
    return words.greeting.some(conversation.includes);
  };

  return {
    is_already_started,
    is_deploy_target_detected,
    is_deploying,
    is_greeting,
  };
};
