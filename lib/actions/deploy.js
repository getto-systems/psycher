const reaction = require("../reply/reaction");
const job = require("../reply/job");

exports.init = (struct) => init(struct);

/**
 * struct : see handler
 */
const init = ({conversation, repository: {stream, pipeline}, i18n}) => {
  const perform = async () => {
    const {team, channel, timestamp} = conversation;
    const target = await conversation.deploy_target();

    try {
      await pipeline.trigger(job.deploy({
        team,
        channel,
        timestamp,
        target,
      }));

      return stream.add(reaction.emoji({
        channel,
        timestamp,
        name: i18n.action.deploy.success,
      }));
    } catch (e) {
      console.error(e);

      return stream.add(reaction.emoji({
        channel,
        timestamp,
        name: i18n.action.deploy.failure,
      }));
    }
  };

  return {
    perform,
  };
};
