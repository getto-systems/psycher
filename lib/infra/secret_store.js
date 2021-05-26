const memoize = require("getto-memoize");

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   aws_secrets: vendor/aws_secrets
 * }
 *
 * returns {
 *   message_token : async () => message_store token
 *   job_targets : async ({team, channel}) => job targets
 *   job_token : async ({team, channel}, target) => job token
 * }
 */
const init = ({aws_secrets}) => {
  const secret = init_secret(aws_secrets);

  const message_token = () => slack_bot_token();

  /**
   * job_signature : conversation.job_signature()
   */
  const job_targets = async (job_signature) => {
    const tokens = await job_tokens(job_signature);
    if (!tokens) {
      return [];
    }
    return Object.keys(tokens);
  };

  /**
   * struct : {
   *   job_signature : conversation.job_signature()
   *   target : deploy target
   * }
   */
  const job_token = async ({job_signature, target}) => {
    const tokens = await job_tokens(job_signature);
    if (tokens) {
      const info = tokens[target];
      if (info) {
        const {project_id, token, release_key} = info;
        if (project_id && token) {
          return {
            project_id,
            token,
            release_key,
          };
        }
      }
    }

    return null;
  };

  const job_tokens = async ({team, channel}) => {
    const tokens = await gitlab_trigger_tokens();

    if (tokens && tokens[team] && tokens[team][channel]) {
      return tokens[team][channel];
    }

    return null;
  };

  const slack_bot_token = () => secret.string("slack-bot-token");
  const gitlab_trigger_tokens = () => secret.json("gitlab-trigger-tokens");

  return {
    message_token,
    job_targets,
    job_token,
  };
};

/**
 * returns {
 *   string : async (key) => get secret string value
 *   json : async (key) => get secret json value
 * }
 */
const init_secret = (aws_secrets) => {
  const memo = memoize.init({
    load: () => aws_secrets.getJSON(),
  });

  const string = (key) => memo.get(key, (data) => data[key]);
  const json = (key) => memo.get(key, (data) => JSON.parse(data[key]));

  return {
    string,
    json,
  };
};
