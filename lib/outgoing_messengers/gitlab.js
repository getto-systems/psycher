const https = require("https");
const FormData = require("form-data");

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
      return https_request(bot_event, token, secret);
    } else {
      console.error("gitlab trigger not found");
    }
  };

  return {
    trigger: trigger,
  };
};

const https_request = (bot_event, token, secret) => {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    const options = {
      hostname: "gitlab.com",
      port: 443,
      path: "/api/v4/projects/" + token.project_id + "/trigger/pipeline",
      method: "POST",
      headers: form.getHeaders(),
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

    form.append("token", token.token);
    form.append("ref", "master");
    form.append("variables[RELEASE]", "true");
    form.append("variables[channel]", bot_event.channel);
    form.append("variables[timestamp]", bot_event.timestamp);

    form.pipe(request);
  });
};
