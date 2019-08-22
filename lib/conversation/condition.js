const specification = require("getto-specification");

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   includes_some : (words) => check conversation text includes word
 *   is_not_started : () => check conversation is started
 *   has_deploy_target : () => check conversation has deploy target
 * }
 */
const init = (conversation) => {
  const spec = specification.init();

  const is_not_started_and = (conditions) => {
    return spec.all([is_not_started].concat(conditions));
  };

  const is_not_started = spec.init(() => {
    return conversation.is_not_started();
  });

  const includes_some = (words) => {
    return spec.init(() => {
      return conversation.includes_some(words);
    });
  };

  const has_deploy_target = spec.init(() => {
    return conversation.has_deploy_target();
  });

  return {
    is_not_started_and,
    includes_some,
    not_includes_any: (words) => spec.not(includes_some(words)),
    has_deploy_target,
    has_no_deploy_target: spec.not(has_deploy_target),
  };
};
