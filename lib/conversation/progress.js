exports.init = (struct) => init(struct);

/**
 * struct : {
 *   session
 * }
 *
 * returns {
 *   init : (session_id) => progress
 * }
 */
const init = ({session}) => {
  /**
   * returns {
   *   start : () => start progress. throw error if failed
   * }
   */
  const init = (session_id) => {
    let is_started = false;

    const start = () => {
      if (is_started) {
        return null;
      }

      is_started = true;
      return session.start(session_id);
    };

    return {
      start,
    };
  };

  return {
    init,
  };
};
