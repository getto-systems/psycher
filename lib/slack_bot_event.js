exports.init = (struct) => init(struct);

/**
 * struct : {
 *   event_info: {
 *     type: slack event type
 *     team: slack team
 *     channel: slack channel
 *     timestamp: slack event timestamp
 *     text: slack text
 *   },
 *   secret : {
 *     slack: secrets/slack
 *     gitlab: secrets/gitlab
 *   },
 * }
 *
 * returns {
 *   is_release() => check release mention
 *   is_greeting() => check greeting mention
 *   is_mention() => check mention
 *
 *   slack_secret() => init slack secret
 *   gitlab_secret() => init gitlab secret
 * }
 */
const init = ({event_info, secret}) => {
  const type = event_info.type;
  const team = event_info.team;
  const channel = event_info.channel;
  const timestamp = event_info.timestamp;
  const text = event_info.text;

  const is_app_mention = (type === "app_mention");

  const app_mention_includes = (word) => {
    return is_app_mention && text.includes(word);
  };

  const is_release = () => {
    return app_mention_includes("リリース") || app_mention_includes("release");
  };

  const is_greeting = () => {
    return app_mention_includes("よろ");
  };

  const is_mention = () => {
    return is_app_mention;
  };

  const slack_secret = () => {
    return secret.slack.init({
      channel,
      timestamp,
    });
  };

  const gitlab_secret = () => {
    return secret.gitlab.init({
      team,
      channel,
      timestamp,
      text,
    });
  };

  return {
    is_release,
    is_greeting,
    is_mention,

    slack_secret,
    gitlab_secret,
  };
};
