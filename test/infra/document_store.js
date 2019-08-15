exports.init = (data) => init(data);

/**
 * returns infra/document_store
 */
const init = ({started_conversations_exists}) => {
  const started_conversations = {
    put: async () => null,
    exists: async () => started_conversations_exists,
  };

  return {
    started_conversations,
  };
};
