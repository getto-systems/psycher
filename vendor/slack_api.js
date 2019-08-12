const fetch = require("node-fetch");

exports.init = () => init();

/**
 * returns {
 *   chat: chat api
 *   reactions: reactions api
 * }
 */
const init = () => {
  return {
    chat,
    reactions,
  };
};

const chat = {
  /**
   * struct : {
   *   token: slack bot token
   *   channel: slack channel
   *   text : message text
   * }
   */
  postMessage: ({token, channel, text}) => {
    return request({
      path: "/api/chat.postMessage",
      token,
      data: {
        channel,
        text,
      },
    });
  },
};

const reactions = {
  /**
   * struct : {
   *   token: slack bot token
   *   channel: slack channel
   *   timestamp: event timestamp
   *   name : reaction name
   * }
   */
  add: ({token, channel, timestamp, name}) => {
    return request({
      path: "/api/reactions.add",
      token,
      data: {
        channel,
        timestamp,
        name,
      },
    });
  },
};

const request = ({path, token, data}) => {
  const url = "https://slack.com" + path;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
};
