exports.init = (struct) => init(struct);

/**
 * struct : {
 *   secret_store: infra/secret_store
 * }
 *
 * returns {
 *   target: (deployment_signature) => find deploy target
 * }
 */
const init = ({secret_store}) => {
  /**
   * deployment_signature : conversation/deployment_signature
   */
  const target = async ({team, channel, text}) => {
    const tokens = await secret_store.job_tokens({team, channel});

    if (tokens) {
      const targets = Object.keys(tokens);
      if (targets.length == 1) {
        return targets[0];
      }

      const filtered = targets.filter((word) => text.includes(word));
      if (filtered.length > 0) {
        return filtered[0];
      }
    }

    return null;
  };

  return {
    target,
  };
};
