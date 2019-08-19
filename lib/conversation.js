const condition_factory = require("./conversation/condition");
const progress_factory = require("./conversation/progress");
const replyer_factory = require("./conversation/replyer");
const job_factory = require("./conversation/job");

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   event_info: {
 *     team : slack team
 *     channel : slack channel
 *     timestamp : event timestamp
 *     text : message text
 *   }
 *   repository: {
 *     session
 *     stream
 *     deployment
 *     pipeline
 *   }
 * }
 *
 * returns {
 *   condition : check conversation condition
 *   reply : (messages) => reply message
 *   reaction : (name) => add reaction
 *   trigger_deploy_job : () => trigger deploy job
 * }
 */
const init = ({event_info: {team, channel, timestamp, text}, repository}) => {
  const session_id = {
    team,
    channel,
    timestamp,
  };

  const reply_to = {
    channel,
    timestamp,
  };

  const job_signature = {
    team,
    channel,
  };

  const includes = (word) => text.includes(word);
  const includes_some = (words) => words.some(includes);

  const progress = progress_factory.init({
    session_id,
    repository,
  });

  const replyer = replyer_factory.init({
    reply_to,
    repository,
  });

  const job = job_factory.init({
    job_signature,
    reply_to,
    includes,
    repository,
  });

  const is_not_started = () => progress.is_not_started();

  const reply = (messages) => replyer.message(messages);
  const reaction = (name) => replyer.reaction(name);

  const has_deploy_target = () => job.has_deploy_target();
  const trigger_deploy_job = () => job.trigger_deploy_job();

  const condition = condition_factory.init({
    includes_some,
    is_not_started,
    has_deploy_target,
  });

  return {
    condition,
    reply,
    reaction,
    trigger_deploy_job,
  };
};
