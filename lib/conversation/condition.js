exports.init = (struct) => init(struct);

/**
 * struct : {
 *   includes_some : (words) => check conversation text includes word
 *   is_not_started : () => check conversation is started
 *   has_deploy_target : () => check conversation has deploy target
 * }
 */
const init = (conversation) => {
  const all = (conditions) => {
    const matches = async () => {
      for(let i in conditions) {
        const condition = conditions[i];
        if (!(await condition.matches())) {
          return false;
        }
      }

      return true;
    };

    return {
      matches,
    };
  };

  const not = (condition) => {
    const matches = async () => {
      return !(await condition.matches());
    };

    return {
      matches,
    };
  };

  const init = (condition) => {
    let result = null;
    const matches = async () => {
      if (!result) {
        result = {
          matches: await condition(),
        };
      }
      return result.matches;
    };

    return {
      matches,
    };
  };

  const is_not_started_and = (conditions) => {
    return all([is_not_started].concat(conditions));
  };

  const is_not_started = init(() => {
    return conversation.is_not_started();
  });

  const includes_some = (words) => {
    return init(() => {
      return conversation.includes_some(words);
    });
  };

  const has_deploy_target = init(() => {
    return conversation.has_deploy_target();
  });

  return {
    is_not_started_and,
    includes_some,
    not_includes_any: (words) => not(includes_some(words)),
    has_deploy_target,
    has_no_deploy_target: not(has_deploy_target),
  };
};
