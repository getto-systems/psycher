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
 *   factory: {
 *     progress
 *     reply
 *     target
 *   }
 * }
 *
 * returns {
 *   includes : (word) => check text includes word
 *
 *   is_already_started : () => check conversation is already started
 *
 *   reply : (messages) => reply message
 *   reaction : (name) => add reaction
 *
 *   has_no_deploy_target : () => check deploy target is detected
 *   trigger_deploy_job : () => trigger deploy job
 * }
 */
const init = ({event_info: {type, team, channel, timestamp, text}, factory}) => {
  const includes = (word) => text.includes(word);
  const includes_some = (words) => words.some(includes);

  const is_already_started = async () => {
    try {
      await progress().start();
      return false;
    } catch (e) {
      return true;
    };
  };

  const reply = (messages) => {
    return factory.reply.message({
      reply_to: reply_to(),
      messages,
    }).post();
  };

  const reaction = (name) => {
    return factory.reply.reaction({
      reply_to: reply_to(),
      name,
    }).add();
  };

  const has_no_deploy_target = () => job().has_no_deploy_target();
  const trigger_deploy_job = () => job().trigger_deploy_job();


  let progress_data = null;
  const progress = () => {
    if (!progress_data) {
      progress_data = factory.progress.init(session_id());
    }
    return progress_data;
  };

  let job_data = null;
  const job = () => {
    if (!job_data) {
      job_data = factory.job.init({
        job_signature: job_signature(),
        reply_to: reply_to(),
        includes,
      });
    }
    return job_data;
  };


  const session_id = () => {
    return {
      team,
      channel,
      timestamp,
    };
  };

  const reply_to = () => {
    return {
      channel,
      timestamp,
    };
  };

  const job_signature = () => {
    return {
      team,
      channel,
    };
  };

  return {
    includes,
    includes_some,

    is_already_started,

    reply,
    reaction,

    has_no_deploy_target,
    trigger_deploy_job,
  };
};
