exports.init = (struct) => init(struct);

/**
 * struct : {
 *   team: slack team
 *   channel: slack channel
 *   timestamp: event timestamp
 * }
 */
const init = ({team, channel, timestamp}) => {
  return {
    team,
    channel,
    timestamp,
  };
};
