exports.init = (struct) => init(struct);

/**
 * struct : {
 *   uuid_store : infra/uuid_store
 *   document_store : infra/document_store
 * }
 *
 * returns {
 *   start: async (session_id) => register new session. throw error if already registered
 * }
 */
const init = ({uuid_store, document_store}) => {
  const started_conversations = document_store.started_conversations;

  const generate_uuid = () => uuid_store.generate_uuid();

  /**
   * progress_signature : conversation/progress.signature()
   */
  const is_not_started = async (progress_signature) => {
    await started_conversations.put(progress_signature);
    return started_conversations.exists(progress_signature);
  };

  return {
    generate_uuid,
    is_not_started,
  };
};
