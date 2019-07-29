exports.init = () => init();

const init = () => {
  const data = {
    slack: 0,
    gitlab: 0,
  };

  const slack_reply = async (message) => {
    data.slack ++;
  };
  const slack_reply_random = async (messages) => {
    data.slack ++;
  };
  const slack_add_reaction = async (emoji) => {
    data.slack ++;
  };

  const gitlab_trigger = async () => {
    data.gitlab ++;
  };

  return {
    slack: {
      reply: slack_reply,
      reply_random: slack_reply_random,
      add_reaction: slack_add_reaction,
    },
    gitlab: {
      trigger: gitlab_trigger,
    },

    data: data,
  };
};
