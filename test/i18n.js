exports.init = () => init();

const init = () => {
  return {
    app_mention: {
      action: {
        deploy: {
          success: "success",
          failure: "failure",
        },
        deploy_target_not_found: {
          messages: [
            "deploy_target_not_found",
          ],
        },
        greeting: {
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
      conversation: {
        words: {
          deploy: [
            "deploy",
          ],
          greeting: [
            "hello",
          ],
        },
      },
    },
  };
};
