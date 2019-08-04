exports.perform = (slack, gitlab) => perform(slack, gitlab);

/**
 * slack : outgoing_messengers/slack
 * gitlab : outgoing_messengers/gitlab
 */
const perform = (slack, gitlab) => {
  return Promise.all([
    gitlab.trigger("release"),
    slack.reaction("release-triggered", "thumbsup"),
  ]);
};
