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
 *     session
 *     deployment
 *     stream
 *     pipeline
 *   }
 * }
 *
 * returns {
 *   includes : (word) => check text includes word
 *
 *   is_already_started : () => check conversation is already registered in session
 *
 *   reply : (messages) => reply to stream
 *   reaction : (name) => add reaction to stream
 *
 *   is_deploy_target_detected : () => check deploy target is detected
 *   trigger_deploy_job : () => trigger deploy job to pipeline
 * }
 */
const init = ({
  event_info: {type, team, channel, timestamp, text},
  repository: {session, deployment, stream, pipeline},
}) => {
  const includes = (word) => text.includes(word);

  const is_already_started = () => {
    return session.is_already_started(session_id());
  };

  const session_id = () => {
    return {
      team,
      channel,
      timestamp,
    };
  };

  const reply = (messages) => {
    return stream.post({
      reply_to: reply_to(),
      text: sample(messages),
    });
  };

  const reaction = (name) => {
    return stream.add({
      reply_to: reply_to(),
      name,
    });
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

const sample = (messages) => {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
};
