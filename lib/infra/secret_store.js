const memoize = require("getto-memoize");

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   aws_secrets: vendor/aws_secrets
 * }
 *
 * returns {
 *   message_token : async () => message_store token : string
 *   job_tokens : async ({team, channel}) => job_store tokens : json
 * }
 */
const init = ({aws_secrets}) => {
  const secret = init_secret(aws_secrets);

  return {
    message_token: () => secret.string("slack-bot-token"),

    /**
     * job_signature : conversation.job_signature()
     */
    job_tokens: async ({team, channel}) => {
      const tokens = await secret.json("gitlab-trigger-tokens")

      if (tokens && tokens[team] && tokens[team][channel]) {
        return tokens[team][channel];
      }

      return null;
    },
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
