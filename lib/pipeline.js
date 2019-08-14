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
   * job_signature : conversation.job_signature()
   * reply_to : conversation.reply_to()
   * target : deploy target
   */
  const deploy = async ({job_signature, reply_to, target}) => {
    const job_token = await secret_store.job_token({job_signature, target});
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
