exports.init = (struct) => init(struct);

/**
 * struct : {
 *   secret_store: infra/secret_store
 * }
 *
 * returns {
 *   target: (job_signature) => find deploy target
 * }
 */
const init = ({secret_store}) => {
  /**
   * struct : {
   *   job_signature : conversation.job_signature()
   *   includes : (target) => check target is deploy target
   * }
   */
  const target = async ({job_signature, includes}) => {
    const tokens = await secret_store.job_tokens(job_signature);

    if (tokens) {
      const targets = Object.keys(tokens);
      if (targets.length == 1) {
        return targets[0];
      }

      const filtered = targets.filter(includes);
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
