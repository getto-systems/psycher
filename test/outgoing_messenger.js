exports.init = () => init();

const init = () => {
  const data = {
    slack: {
      message: [],
      reaction: [],
    },
    gitlab: [],
  };

  const slack_reply = async (info, message) => {
    data.slack.message.push(info);
  };
  const slack_reply_random = async (info, messages) => {
    data.slack.message.push(info);
  };
  const slack_add_reaction = async (info, emoji) => {
    data.slack.reaction.push(info);
  };

  const gitlab_trigger = async (info) => {
    data.gitlab.push(info);
  };
  const null_gitlab_trigger = (info) => {
    data.gitlab.push(info);
    return null;
  };

  return {
    slack: {
      reply: slack_reply,
      reply_random: slack_reply_random,
      add_reaction: slack_add_reaction,
    },
    gitlab: {
      trigger: gitlab_trigger,
      null_trigger: null_gitlab_trigger,
    },

    data: data,
  };
};
