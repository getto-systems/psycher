exports.init = (struct) => init(struct);

/**
 * struct : {
 *   slack: {
 *     bot_token: slack bot token
 *   },
 *   gitlab: {
 *     release_targets: { "CHANNEL": "elm,rails" } // comma separated
 *     trigger_tokens: { "CHANNEL": { "elm": { project: "PROJECT_ID", token: "TOKEN" } }
 *   },
 * }
 */
const init = (struct) => {
  return {
    slack: {
      bot_token: struct.slack.bot_token,
    },
    gitlab: gitlab({
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
        const info = struct.tokens[channel][target];
        if (info) {
          return {
            project_id: info.project_id,
            token: info.token,
          };
        }
      }
    }

    return null;
  };

  return {
    find_token: find_token,
  };
};
