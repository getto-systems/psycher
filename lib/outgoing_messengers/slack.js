const https = require("https");

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
    return https_request("/api/chat.postMessage", data, secret);
  };

  const reply_random = (info, messages) => {
    console.log("slack reply : " + info);

    const index = Math.floor(Math.random() * messages.length);
    return reply(messages[index]);
  };

  const add_reaction = (info, emoji) => {
    console.log("slack reaction : " + info);

    const data = {
      channel: bot_event.channel,
      timestamp: bot_event.timestamp,
      name: emoji,
    };
    console.log("slack add reaction : " + emoji);
    return https_request("/api/reactions.add", data, secret);
  };

  return {
    reply: reply,
    reply_random: reply_random,
    add_reaction: add_reaction,
  };
};

const https_request = (path, data, secret) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "slack.com",
      port: 443,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": "Bearer " + secret.slack.bot_token,
      },
    };
    const request = https.request(options, (response) => {
      console.log({responseCode: response.statusCode});
      let body = "";
      response.on("data", (data) => {
        body += data;
      });
      response.on("end", () => {
        console.log({body: body});
        resolve("done");
      });
    });
    request.on("error", (e) => {
      reject(e);
    });
    request.write(JSON.stringify(data));
    request.end();
  });
};
