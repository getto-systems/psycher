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
 *   is_not_started : () => start progress. throw error if failed
 * }
 */
const init = ({session_id, repository: {session}}) => {
  const progress_id = session.generate_uuid();

  const signature = {
    session_id,
    progress_id,
  };

  const is_not_started = () => session.is_not_started(signature);

  return {
    is_not_started,
  };
};
