exports.operate = (struct) => operate(struct);

/**
 * struct : {
 *   state: state,
 *   action: action,
 * }
 */
const operate = async ({state, action}) => {
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

  if (await state.is_mention()) {
    return action.unknown_mention();
  }

  return action.noop();
};
