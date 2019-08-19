exports.init = (struct) => init(struct);

/**
 * struct : {
 *   i18n
 *   conversation
 * }
 */
const init = ({i18n, conversation}) => {
  const condition = conversation.condition;

  const deploy = {
    condition: condition.is_not_started_and([
      condition.includes_some(i18n.deploy.words),
      condition.has_deploy_target,
    ]),
    perform: async () => {
      try {
        await conversation.trigger_deploy_job();
        return conversation.reaction(i18n.deploy.success);

      } catch (e) {
        console.error(e);

        return conversation.reaction(i18n.deploy.failure);
      }
    },
  };

  const deploy_target_not_found = {
    condition: condition.is_not_started_and([
      condition.includes_some(i18n.deploy.words),
      condition.has_no_deploy_target,
    ]),
    perform: () => {
      return conversation.reply(i18n.deploy_target_not_found.messages);
    },
  };

  const greeting = {
    condition: condition.is_not_started_and([
      condition.not_includes_any(i18n.deploy.words),
      condition.includes_some(i18n.greeting.words),
    ]),
    perform: () => {
      return conversation.reply(i18n.greeting.messages);
    },
  };

  const unknown_mention = {
    condition: condition.is_not_started_and([
      condition.not_includes_any(i18n.deploy.words),
      condition.not_includes_any(i18n.greeting.words),
    ]),
    perform: () => {
      return conversation.reply(i18n.unknown_mention.messages);
    },
  };

  return [
    deploy,
    deploy_target_not_found,
    greeting,
    unknown_mention,
  ];
};
