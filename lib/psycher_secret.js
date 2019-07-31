exports.init = (struct) => init(struct);

/**
 * struct : {
 *   slack: {
 *     bot_token: slack bot token
 *   },
 *   gitlab: {
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
      tokens: struct.gitlab.trigger_tokens,
    }),
  };
};

const gitlab = (struct) => {
  const find_token = (bot_event) => {
    const find_target = (targets) => {
      if (targets.length == 1) {
        return targets[0];
      }
      return targets.filter((word) => bot_event.app_mention_includes(word))[0];
    };

    const tokens = struct.tokens[bot_event.channel];

    if (tokens) {
      const target = find_target(Object.keys(tokens));
      if (target) {
        const info = tokens[target];
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
