exports.init = () => init();

const init = () => {
  return {
    mention: {
      deploy: {
        words: [
          "deploy",
        ],
        success: "success",
        failure: "failure",
      },
      deploy_target_not_found: {
        messages: [
          "deploy_target_not_found",
        ],
      },
      greeting: {
        words: [
          "hello",
        ],
        messages: [
          "greeting",
        ],
      },
      unknown_mention: {
        messages: [
          "unknown_mention",
        ],
      },
    },
  };
};
