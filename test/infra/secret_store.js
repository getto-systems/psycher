exports.init = (data) => init(data);

/**
 * data : {
 *   message_token: message token
 *   job_tokens: job tokens
 * }
 *
 * returns infra/secret_store
 */
const init = ({message_token, job_tokens}) => {
  return {
    message_token: async () => message_token,
    job_tokens: async ({team, channel}) => job_tokens,
  };
};
