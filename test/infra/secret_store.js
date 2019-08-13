exports.init = (data) => init(data);

/**
 * data : {
 *   message_token: message token
 *   job_targets: job targets
 *   job_token: job token
 * }
 *
 * returns infra/secret_store
 */
const init = ({message_token, job_targets, job_token}) => {
  return {
    message_token: async () => message_token,
    job_targets: async () => job_targets,
    job_token: async () => job_token,
  };
};
