exports.init = (struct) => init(struct);

/**
 * struct : {
 *   slack: {
 *     bot_token: slack bot token
 *   },
 *   gitlab: {
 *     user_id: gitlab user id
 *     release_targets: { "CHANNEL": "elm,rails" } // comma separated
 *     trigger_tokens: { "CHANNEL": { "elm": "TOKEN", "rails": "TOKEN" } }
 *   },
 * }
 */
const init = (struct) => {
  return {
    slack: {
      bot_token: struct.slack.bot_token,
    },
    gitlab: gitlab({
      user_id: struct.gitlab.user_id,
      targets: struct.gitlab.release_targets,
      tokens: struct.gitlab.trigger_tokens,
    }),
  };
};

const gitlab = (struct) => {
  const find_token = (bot_event) => {
    const channel = bot_event.channel;

    const find_target = (targets) => {
      if (targets.length == 1) {
        return targets[0];
      }
      return targets.filter((word) => bot_event.app_mention_includes(word))[0];
    };

    if (struct.targets[channel] && struct.tokens[channel]) {
      const target = find_target(struct.targets[channel].split(","));
      if (target) {
        return struct.tokens[channel][target];
      }
    }

    return null;
  };

  return {
    user_id: struct.user_id,
    find_token: find_token,
  };
};
