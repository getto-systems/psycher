const session_id = require("./conversation/session_id");
const deployment_signature = require("./conversation/deployment_signature");

const memoize = require("getto-memoize");

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   event_info: {
 *     type : event type
 *     team : slack team
 *     channel : slack channel
 *     timestamp : event timestamp
 *     text : message text
 *   }
 *   repository: {
 *     session : session
 *     deployment : deployment
 *   }
 *   i18n: i18n
 * }
 */
const init = ({event_info: {type, team, channel, timestamp, text}, repository: {session, deployment}, i18n}) => {
  const is_app_mention = (type === "app_mention");

  const is_deploy = () => {
    return is_app_mention && i18n.conversation.words.deploy.some((word) => text.includes(word));
  };

  const is_greeting = () => {
    return is_app_mention && i18n.conversation.words.greeting.some((word) => text.includes(word));
  };

  const is_mention = () => {
    return is_app_mention;
  };

  const state = init_state({
    session,
    id: session_id.init({
      team,
      channel,
      timestamp,
    }),
  });

  const deploy_target = init_deploy_target({
    deployment,
    signature: deployment_signature.init({
      team,
      channel,
      text,
    }),
  });

  return {
    team,
    channel,
    timestamp,
    text,

    is_deploy,
    is_greeting,
    is_mention,

    is_already_started: state.is_already_started,

    has_deploy_target: deploy_target.exists,
    deploy_target: deploy_target.get,
  };
};

/**
 * returns {
 *   is_already_started: async () => check conversation operation is already started
 * }
 */
const init_state = ({session, id}) => {
  const is_already_started = () => {
    return session.is_already_started(id);
  };

  return {
    is_already_started,
  };
};

/**
 * returns {
 *   get: async () => get deploy target
 *   exists: async () => is deploy target exists
 * }
 */
const init_deploy_target = ({deployment, signature}) => {
  const memo = memoize.init({
    load: () => deployment.target(signature),
  });

  const get = () => memo.get("target", (data) => data);
  const exists = async () => !!(await get());

  return {
    get,
    exists,
  };
};
