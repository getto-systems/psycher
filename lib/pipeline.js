exports.init = (struct) => init(struct);

/**
 * struct : {
 *   secret_store: infra/secret_store
 *   job_store: infra/job_store
 * }
 *
 * returns {
 *   deploy: (job, target) => trigger deploy job
 * }
 */
const init = ({secret_store, job_store}) => {
  /**
   * deployment_signature : conversation.deployment_signature()
   * reply_to : conversation.reply_to()
   */
  const deploy = async ({deployment_signature, reply_to}) => {
    const job_token = await secret_store.job_token(deployment_signature);
    if (!job_token) {
      throw "job token not found";
    }

    return job_store.deploy({
      job_token,
      reply_to,
    });
  };

  return {
    deploy,
  };
};
