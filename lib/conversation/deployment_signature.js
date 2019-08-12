exports.init = (struct) => init(struct);

/**
 * struct : {
 *   team: slack team
 *   channel: slack channel
 *   text: message text
 * }
 */
const init = ({team, channel, text}) => {
  return {
    team,
    channel,
    text,
  };
};
