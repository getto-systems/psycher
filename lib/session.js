exports.init = (struct) => init(struct);

/**
 * struct : {
 *   document_store : infra/document_store
 * }
 *
 * returns {
 *   is_already_started: async (session_id) => check there is already started conversation
 * }
 */
const init = ({document_store}) => {
  /**
   * session_id : conversation.session_id()
   */
  const is_already_started = async (session_id) => {
    const is_success = await document_store.started_conversations.put(session_id);
    return !is_success;
  };

  return {
    is_already_started,
  };
};
