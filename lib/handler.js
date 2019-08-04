const actions = {
  greeting: require("./actions/greeting"),
  release: require("./actions/release"),
  unknown_release: require("./actions/unknown_release"),
  unknown_mention: require("./actions/unknown_mention"),
};

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   bot_event : slack_bot_event
 *   messenger : {
 *     slack: prepared outgoing_messengers/slack
 *     gitlab: prepared outgoing_messengers/gitlab
 *   }
 * }
 */
const init = ({bot_event, messenger}) => {
  const handle_event = () => {
    if (bot_event.is_release()) {
      return release();
    }

    if (bot_event.is_greeting()) {
      return greeting();
    }

    if (bot_event.is_mention()) {
      return unknown_mention();
    }

    return null;
  };

  const release = () => {
    const secret = bot_event.gitlab_secret();
    if (secret) {
      return actions.release.perform(slack_messenger(), gitlab_messenger(secret));
    } else {
      return actions.unknown_release.perform(slack_messenger());
    }
  };

  const greeting = () => {
    return actions.greeting.perform(slack_messenger());
  };

  const unknown_mention = () => {
    return actions.unknown_mention.perform(slack_messenger());
  };


  const slack_messenger = () => {
    return messenger.slack.init(bot_event.slack_secret());
  };
  const gitlab_messenger = (secret) => {
    return messenger.gitlab.init(secret);
  };


  return {
    handle_event,
  };
};
