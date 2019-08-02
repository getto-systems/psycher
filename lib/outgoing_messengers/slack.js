const fetch = require("node-fetch");

exports.init = (bot_event, secret) => init(bot_event, secret);

/**
 * bot_event : slack_bot_event
 * secret : psycher_secret
 */
const init = (bot_event, secret) => {
  const reply = (info, message) => {
    console.log("slack reply : " + info);

    const data = {
      channel: bot_event.channel,
      text: message,
    };
    console.log("slack post message : " + message);
    return request("/api/chat.postMessage", data, secret);
  };

  const reply_random = (info, messages) => {
    const index = Math.floor(Math.random() * messages.length);
    return reply(info, messages[index]);
  };

  const add_reaction = (info, emoji) => {
    console.log("slack reaction : " + info);

    const data = {
      channel: bot_event.channel,
      timestamp: bot_event.timestamp,
      name: emoji,
    };
    console.log("slack add reaction : " + emoji);
    return request("/api/reactions.add", data, secret);
  };

  return {
    reply: reply,
    reply_random: reply_random,
    add_reaction: add_reaction,
  };
};

const request = async (path, data, secret) => {
  const url = "https://slack.com" + path;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + secret.slack.bot_token,
    },
    body: JSON.stringify(data),
  });

  console.log("response code: " + response.status);
};
