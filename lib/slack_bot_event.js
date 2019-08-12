const conversation = require("./conversation");

exports.parse = (struct) => parse(struct);

/**
 * struct : {
 *   raw_event: {
 *     type: slack event type
 *     team: slack team
 *     channel: slack channel
 *     ts: slack event timestamp
 *     text: slack text
 *   },
 *   repository: see conversation
 *   i18n: i18n
 * }
 *
 * returns conversation
 */
const parse = ({raw_event, repository, i18n}) => {
  const event_info = {
    type: raw_event.type,
    team: raw_event.team,
    channel: raw_event.channel,
    timestamp: raw_event.ts,
    text: raw_event.text,
  };

  return conversation.init({
    event_info,
    repository,
    i18n,
  });
};
