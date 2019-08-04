exports.prepare = (secret) => prepare(secret);

/**
 * secret : {
 *   trigger_tokens: {
 *     "TEAM": {
 *       "CHANNEL": { "elm": { project_id: "PROJECT_ID", token: "TOKEN" } }
 *     }
 *   }
 * }
 * struct : {
 *   team: slack team
 *   channel: slack channel
 *   timestamp: event timestamp
 *   text: slack message
 * }
 *
 * returns {
 *   channel,
 *   timestamp,
 *   project_id,
 *   trigger_token,
 * }
 */
const prepare = (secret) => {
  const init = ({team, channel, timestamp, text}) => {
    const find_target = (targets) => {
      if (targets.length == 1) {
        return targets[0];
      }
      return targets.filter((word) => text.includes(word))[0];
    };

    const channels = secret.trigger_tokens[team];
    if (!channels) {
      return null;
    }

    const tokens = channels[channel];
    if (!tokens) {
      return null;
    }

    const target = find_target(Object.keys(tokens));
    if (!target) {
      return null;
    }

    const info = tokens[target];
    if (!info) {
      return null;
    }

    const {project_id, token} = info;
    if (!project_id || !token) {
      return null;
    }

    const trigger_token = token;

    return {
      channel,
      timestamp,
      project_id,
      trigger_token,
    };
  };

  return {
    init,
  };
};
