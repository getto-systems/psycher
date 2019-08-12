exports.init = (struct) => init(struct);

/**
 * struct : {
 *   secret_store: infra/secret_store
 *   job_store: infra/job_store
 * }
 *
 * returns {
 *   trigger: (job) => trigger deploy job
 * }
 */
const init = ({secret_store, job_store}) => {
  /**
   * job : reply/job
   */
  const trigger = async ({team, channel, timestamp, target}) => {
    const tokens = await secret_store.job_tokens({team, channel});
    const {project_id, token} = find_token(tokens[target]);

    return job_store.deploy({
      project_id,
      token,
      channel,
      timestamp,
    });
  };

  return {
    trigger,
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
