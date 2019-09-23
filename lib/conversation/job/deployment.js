exports.init = (struct) => init(struct);

/**
 * struct : {
 *   secret_store: infra/secret_store
 * }
 *
 * returns {
 *   targets: (job_signature) => find deploy target
 * }
 */
const init = ({secret_store}) => {
  /**
   * struct : {
   *   job_signature : conversation.job_signature()
   * }
   */
  const targets = ({job_signature}) => {
    return secret_store.job_targets(job_signature);
  };

  return {
    targets,
  };
};
