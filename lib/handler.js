const handlers = [
  "app_mention",
];

exports.handlers = () => handlers;
exports.init = (type) => init(type);

/**
 * type : event type
 */
const init = (type) => {
  if (!handlers.includes(type)) {
    throw "unknown event type: " + type;
  }

  return require("./handlers/" + type);
};
