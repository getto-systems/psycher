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
    const tokens = await secret_store.job_tokens(job_signature);
    const {project_id, token} = find_token(tokens[target]);

    return job_store.deploy({
      project_id,
      token,
      reply_to,
    });
  };

  return {
    deploy,
  };
};

const find_token = (info) => {
  if (info) {
    const {project_id, token} = info;
    if (project_id && token) {
      return {
        project_id,
        token,
      };
    }
  }

  throw "job token not found";
};
