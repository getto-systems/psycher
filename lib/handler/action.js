exports.init = (struct) => init(struct);

/**
 * struct : {
 *   conversation,
 *   action : i18n.action
 * }
 */
const init = ({conversation, action}) => {
  const noop = () => null;

  const deploy = async () => {
    try {
      await conversation.trigger_deploy_job();
      return conversation.reaction(action.deploy.success);

    } catch (e) {
      console.error(e);

      return conversation.reaction(action.deploy.failure);
    }
  };

  const deploy_target_not_found = () => {
    return conversation.reply(action.deploy_target_not_found.messages);
  };

  const greeting = () => {
    return conversation.reply(action.greeting.messages);
  };

  const unknown_mention = () => {
    return conversation.reply(action.unknown_mention.messages);
  };

  return {
    noop,
    deploy,
    deploy_target_not_found,
    greeting,
    unknown_mention,
  };
};
