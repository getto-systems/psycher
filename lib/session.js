exports.init = (struct) => init(struct);

/**
 * struct : {
 *   document_store : infra/document_store
 * }
 *
 * returns {
 *   start: async (session_id) => register new session. throw error if already registered
 * }
 */
const init = ({document_store}) => {
  /**
   * session_id : conversation.session_id()
   */
  const start = async (session_id) => {
    return document_store.started_conversations.put(session_id);
  };

  return {
    start,
  };
};
