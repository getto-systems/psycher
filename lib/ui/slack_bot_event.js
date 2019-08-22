exports.parse = (body) => parse(body);

/**
 * body : event body
 *
 * returns event_info
 */
const parse = (body) => {
  if (!body || !body.event) {
    return null;
  };

  const event_info = {
    type: body.event.type,
    team: body.event.team,
    channel: body.event.channel,
    timestamp: body.event.ts,
    text: body.event.text,
  };

  if (Object.keys(event_info).some((key) => !event_info[key])) {
    return null;
  }

  return event_info;
};
