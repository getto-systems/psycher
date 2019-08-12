exports.init = (struct) => init(struct);

/**
 * struct : {
 *   conversation : conversation
 *   repository : {
 *     session: session,
 *     deployment: deployment,
 *   }
 *   words : i18n.conversation.words
 * }
 */
const init = ({conversation, repository: {session, deployment}, words}) => {
  const is_already_started = () => {
    return session.is_already_started(conversation.session_id());
  };

  const is_deploy_target_detected = async () => {
    return is_deploying() && !!(await deployment.target(conversation.deployment_signature()));
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
