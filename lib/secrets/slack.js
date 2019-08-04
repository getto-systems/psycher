exports.prepare = (secret) => prepare(secret);

/**
 * secret : {
 *   bot_token: slack bot token
 * }
 * struct : {
 *   channel: slack channel
 *   timestamp: event timestamp
 * }
 *
 * returns {
 *   channel,
 *   timestamp,
 *   bot_token,
 * }
 */
const prepare = (secret) => {
  const init = ({channel, timestamp}) => {
    const bot_token = secret.bot_token;

    return {
      channel,
      timestamp,
      bot_token,
    };
  };

  return {
    init,
  };
};
