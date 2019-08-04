const fetch = require("node-fetch");

exports.reply = (info, secret, text) => reply(info, secret, text);
exports.reaction = (info, secret, name) => reaction(info, secret, name);

/**
 * info : request type (string)
 * secret : {
 *   bot_token: slack bot token
 *   channel: slack channel
 * }
 * text : reply message
 */
const reply = (info, {bot_token, channel}, text) => {
  console.log("slack reply : " + info);
  return request("/api/chat.postMessage", bot_token, {
    channel,
    text,
  });
};

/**
 * info : request type (string)
 * secret : {
 *   bot_token: slack bot token
 *   channel: slack channel
 *   timestamp: event timestamp
 * }
 * name : reaction name
 */
const reaction = (info, {bot_token, channel, timestamp}, name) => {
  console.log("slack reaction : " + info);
  return request("/api/reactions.add", bot_token, {
    channel,
    timestamp,
    name,
  });
};

const request = async (path, bot_token, data) => {
  const url = "https://slack.com" + path;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + bot_token,
    },
    body: JSON.stringify(data),
  });

  console.log("response code: " + response.status);
};
