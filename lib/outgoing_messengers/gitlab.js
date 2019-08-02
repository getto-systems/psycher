const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

exports.init = (bot_event, secret) => init(bot_event, secret);

/**
 * bot_event : slack_bot_event
 * secret : psycher_secret
 */
const init = (bot_event, secret) => {
  const trigger = (info) => {
    console.log("gitlab trigger requested : " + info);
    const token = secret.gitlab.find_token(bot_event);
    if (token) {
      console.log("gitlab triggered");
      return request(bot_event, token, secret);
    } else {
      console.error("gitlab trigger not found");
    }
  };

  return {
    trigger: trigger,
  };
};

const request = async (bot_event, token, secret) => {
  const params = new URLSearchParams();
  params.append("token", token.token);
  params.append("ref", "master");
  params.append("variables[RELEASE]", "true");
  params.append("variables[channel]", bot_event.channel);
  params.append("variables[timestamp]", bot_event.timestamp);

  const url = "https://gitlab.com/api/v4/projects/" + token.project_id + "/trigger/pipeline";

  const response = await fetch(url, {
    method: "POST",
    body: params,
  });

  console.log("response code: " + response.status);
};
