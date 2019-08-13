exports.init = (data) => init(data);

/**
 * returns infra/document_store
 */
const init = ({put_error}) => {
  const started_conversations = {
    put: async () => {
      if (put_error) {
        throw put_error;
      }
    },
  };

  return {
    started_conversations,
  };
};
