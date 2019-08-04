exports.prepare = (request) => prepare(request);

/**
 * request : outgoing_messengers/requests/gitlab
 * secret : secrets/gitlab
 *
 * returns {
 *   trigger: (info) => trigger gitlab pipeline
 * }
 */
const prepare = (request) => {
  const init = (secret) => {
    /**
     * info : request type (string)
     */
    const trigger = (info) => {
      return request.trigger(info, secret);
    };

    return {
      trigger,
    };
  };

  return {
    init,
  };
};
