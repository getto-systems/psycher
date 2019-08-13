exports.init = (struct) => init(struct);

/**
 * struct : {
 *   gitlab_api: vendor/gitlab_api
 * }
 *
 * returns {
 *   deploy : async (struct) => trigger gitlab deploy pipeline
 * }
 */
const init = ({gitlab_api}) => {
  /**
   * struct : {
   *   job_token: secret_store.job_token()
   *   reply_to: conversation.reply_to()
   * }
   */
  const deploy = async ({job_token: {project_id, token}, reply_to: {channel, timestamp}}) => {
    const ref = "master";
    const variables = {
      RELEASE: "true",
      channel,
      timestamp,
    };

    const response = await gitlab_api.trigger({
      project_id,
      token,
      ref,
      variables,
    });
    console.log(response.status);
  };

  return {
    deploy,
  };
};
