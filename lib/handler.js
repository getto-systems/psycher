const action_map = {
  "app_mention": "mention",
};

exports.handler_names = () => handler_names();

exports.detect_actions = (struct) => detect_actions(struct);
exports.perform = (actions) => perform(actions);

const handler_names = () => Object.values(action_map);

/**
 * struct : {
 *   type : event type
 *   i18n
 *   conversation
 * }
 *
 * returns actions
 */
const detect_actions = ({type, i18n, conversation}) => {
  const name = action_map[type];
  if (!name) {
    throw "unknown event type: " + type;
  }

  return require("./actions/" + name).init({
    i18n: i18n[name],
    conversation,
  });
};

/**
 * actions
 */
const perform = async (actions) => {
  for(let i in actions) {
    const action = actions[i];
    if (await action.condition.matches()) {
      return action.perform();
    }
  }

  return null;
};
