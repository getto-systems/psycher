exports.init = (data) => init(data);

/**
 * returns infra/document_store
 */
const init = ({put}) => {
  const started_conversations = {
    put: async () => put,
  };

  return {
    started_conversations,
  };
};
