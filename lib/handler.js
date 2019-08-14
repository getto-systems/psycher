const handlers = {
  "app_mention": "mention",
};

exports.event_types = () => event_types();
exports.handler_names = () => handler_names();
exports.init = (struct) => init(struct);

const event_types = () => Object.keys(handlers);
const handler_names = () => Object.values(handlers);

/**
 * struct : {
 *   type : event type
 *   i18n
 * }
 */
const init = ({type, i18n}) => {
  const handler = detect_handler(type);
  return require("./handlers/" + handler).init(i18n[handler]);
};

const detect_handler = (type) => {
  const handler = handlers[type];
  if (!handler) {
    throw "unknown event type: " + type;
  }

  return handler;
};
