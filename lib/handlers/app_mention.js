const state_factory = require("./app_mention/state");
const action_factory = require("./app_mention/action");

exports.operate = (struct) => operate(struct);

/**
 * struct : {
 *   conversation
 *   i18n
 * }
 */
const operate = async ({conversation, i18n}) => {
  const state = state_factory.init({
    conversation,
    words: i18n.conversation.words,
  });
  const action = action_factory.init({
    conversation,
    action: i18n.action,
  });

  if (await state.is_already_started()) {
    return action.noop();
  }

  if (await state.is_deploy_target_detected()) {
    return action.deploy();
  }

  if (await state.is_deploying()) {
    return action.deploy_target_not_found();
  }

  if (await state.is_greeting()) {
    return action.greeting();
  }

  return action.unknown_mention();
};
