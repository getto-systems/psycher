exports.emoji = (struct) => emoji(struct);

/**
 * struct : {
 *   channel: slack channel
 *   timestamp: event timestamp
 *   name: reaction name
 * }
 */
const emoji = ({channel, timestamp, name}) => {
  return {
    channel,
    timestamp,
    name,
  };
};
