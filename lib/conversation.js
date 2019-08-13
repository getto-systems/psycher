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
 *     deployment
 *     pipeline
 *   }
 *   factory: {
 *     progress
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
 *   is_deploy_target_detected : () => check deploy target is detected
 *   trigger_deploy_job : () => trigger deploy job to pipeline
 * }
 */
const init = ({
  event_info: {type, team, channel, timestamp, text},
  repository: {deployment, pipeline},
  factory,
}) => {
  const includes = (word) => text.includes(word);

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

  let progress_data = null;
  const progress = () => {
    if (!progress_data) {
      progress_data = factory.progress.init(session_id());
    }
    return progress_data;
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


  const is_deploy_target_detected = async () => {
    return !!(await deployment.target(deployment_signature()));
  };

  const trigger_deploy_job = async () => {
    const target = await deployment.target(deployment_signature());
    return pipeline.deploy({
      job_signature: job_signature(),
      reply_to: reply_to(),
      target,
    });
  };

  const job_signature = () => {
    return {
      team,
      channel,
    };
  };

  const deployment_signature = () => {
    return {
      job_signature: job_signature(),
      includes,
    };
  };

  return {
    includes,

    is_already_started,

    reply,
    reaction,

    is_deploy_target_detected,
    trigger_deploy_job,
  };
};
