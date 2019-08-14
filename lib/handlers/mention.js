exports.init = (i18n) => init(i18n);

/**
 * i18n
 */
const init = (i18n) => {
  const deploy = i18n.deploy;
  const deploy_target_not_found = i18n.deploy_target_not_found;
  const greeting = i18n.greeting;
  const unknown_mention = i18n.unknown_mention;

  /**
   * conversation
   */
  const operate = async (conversation) => {
    if (await conversation.is_already_started()) {
      return;
    }

    if (conversation.includes_some(deploy.words)) {
      if (await conversation.has_no_deploy_target()) {
        return conversation.reply(deploy_target_not_found.messages);
      }

      try {
        await conversation.trigger_deploy_job();
        return conversation.reaction(deploy.success);

      } catch (e) {
        console.error(e);

        return conversation.reaction(deploy.failure);
      }
    }

    if (conversation.includes_some(greeting.words)) {
      return conversation.reply(greeting.messages);
    }

    return conversation.reply(unknown_mention.messages);
  };

  return {
    operate,
  };
};
