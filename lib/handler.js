const action = {
  deploy: require("./actions/deploy"),
  deploy_target_not_found: require("./actions/deploy_target_not_found"),
  greeting: require("./actions/greeting"),
  unknown_mention: require("./actions/unknown_mention"),
  noop: require("./actions/noop"),
};

exports.detect_action = (struct) => detect_action(struct);

/**
 * struct : {
 *   conversation : conversation
 *   repository : {
 *     stream: stream
 *     pipeline: pipeline
 *   }
 *   i18n : i18n
 * }
 */
const detect_action = async (struct) => {
  const {conversation} = struct;

  if (await conversation.is_already_started()) {
    return action.noop.init();
  }

  if (conversation.is_deploy()) {
    if (await conversation.has_deploy_target()) {
      return action.deploy.init(struct);
    } else {
      return action.deploy_target_not_found.init(struct);
    }
  }

  if (conversation.is_greeting()) {
    return action.greeting.init(struct);
  }

  if (conversation.is_mention()) {
    return action.unknown_mention.init(struct);
  }

  return action.noop.init();
};
