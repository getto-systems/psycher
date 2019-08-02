exports.init = (struct) => init(struct);

/**
 * struct : {
 *   type: slack event type
 *   team: slack team
 *   channel: slack channel
 *   timestamp: slack event timestamp
 *   text: slack text
 * }
 */
const init = (struct) => {
  const type = struct.type;
  const team = struct.team;
  const channel = struct.channel;
  const timestamp = struct.timestamp;
  const text = struct.text;

  const is_app_mention = (type === "app_mention");

  const app_mention_includes = (word) => {
    return is_app_mention && text.includes(word);
  };

  return {
    team: team,
    channel: channel,
    timestamp: timestamp,
    is_app_mention: is_app_mention,
    app_mention_includes: app_mention_includes,
  };
};
