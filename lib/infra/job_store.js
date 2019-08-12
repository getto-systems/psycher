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
   *   project_id : gitlab project id
   *   token : gitlab trigger token
   *   reply_to: conversation.reply_to()
   * }
   */
  const deploy = async ({project_id, token, reply_to: {channel, timestamp}}) => {
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
