exports.init = (struct) => init(struct);

/**
 * struct : {
 *   session_id : conversation.session_id
 *   repository: {
 *     session
 *   }
 * }
 *
 * returns {
 *   is_already_started : () => start progress. throw error if failed
 * }
 */
const init = ({session_id, repository: {session}}) => {
  const progress_id = session.generate_uuid();

  const signature = {
    session_id,
    progress_id,
  };

  let is_started = null;
  const is_already_started = () => {
    if (!is_started) {
      is_started = {
        result: session.is_already_started(signature),
      };
    }
    return is_started.result;
  };

  return {
    is_already_started,
  };
};
