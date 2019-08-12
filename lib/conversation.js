exports.init = (struct) => init(struct);

/**
 * struct : {
 *   type : event type
 *   team : slack team
 *   channel : slack channel
 *   timestamp : event timestamp
 *   text : message text
 * }
 *
 * returns {
 *   is_mention : () => check type is 'app_mention'
 *   includes : (word) => check text includes word
 *   session_id : () => session store key
 *   reply_to : () => message store key
 *   job_signature : () => job store key
 *   deployment_signature : () => deployment key
 * }
 */
const init = ({type, team, channel, timestamp, text}) => {
  const is_mention = () => (type === "app_mention");
  const includes = (word) => text.includes(word);

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

  const deployment_signature = () => {
    return {
      job_signature: job_signature(),
      includes,
    };
  };

  return {
    is_mention,
    includes,

    session_id,
    reply_to,
    job_signature,
    deployment_signature,
  };
};
