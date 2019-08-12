exports.deploy = (struct) => deploy(struct);

/**
 * struct : {
 *   team: slack team
 *   channel: slack channel
 *   timestamp: event timestamp
 *   target: deploy target
 * }
 */
const deploy = ({team, channel, timestamp, target}) => {
  return {
    team,
    channel,
    timestamp,
    target,
  };
};
