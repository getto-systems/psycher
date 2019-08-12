exports.init = (struct) => init(struct);

/**
 * struct : {
 *   conversation,
 *   repository : {
 *     deployment,
 *     stream,
 *     pipeline,
 *   }
 *   action : i18n.action
 * }
 */
const init = ({conversation, repository: {deployment, stream, pipeline}, action}) => {
  const noop = () => null;

  const deploy = async () => {
    try {
      const target = await deployment.target(conversation.deployment_signature());

      await trigger_deploy_job(target);
      return add_reaction(action.deploy.success);

    } catch (e) {
      console.error(e);

      return add_reaction(action.deploy.failure);
    }
  };

  const deploy_target_not_found = () => {
    return post_random_message(action.deploy_target_not_found.messages);
  };

  const greeting = () => {
    return post_random_message(action.greeting.messages);
  };

  const unknown_mention = () => {
    return post_random_message(action.unknown_mention.messages);
  };


  const trigger_deploy_job = (target) => {
    return pipeline.deploy({
      job_signature: conversation.job_signature(),
      reply_to: conversation.reply_to(),
      target,
    });
  };

  const add_reaction = (name) => {
    return stream.add({
      reply_to: conversation.reply_to(),
      name,
    });
  };

  const post_random_message = (messages) => {
    return stream.post({
      reply_to: conversation.reply_to(),
      text: sample(messages),
    });
  };


  return {
    noop,
    deploy,
    deploy_target_not_found,
    greeting,
    unknown_mention,
  };
};

const sample = (messages) => {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
};
