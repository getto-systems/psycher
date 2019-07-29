const https = require("https");

exports.init = (secret) => init(secret);

/**
 * bot_event : slack_bot_event
 * secret : psycher_secret
 */
const init = (bot_event, secret) => {
  const trigger = () => {
    const token = secret.gitlab.find_token(bot_event);
    if (token) {
      return https_request(bot_event, token, secret);
    }
  };

  return {
    trigger: trigger,
  };
};

const https_request = (bot_event, token, secret) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "gitlab.com",
      port: 443,
      path: "/api/v4/projects/" + secret.gitlab.user_id + "/trigger/pipeline",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
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
    request.write("token=" + token + "\n");
    request.write("ref=master" + "\n");
    request.write("variables[RELEASE]=true" + "\n");
    request.write("variables[timestamp]=" + bot_event.timestamp + "\n");
    request.end();
  });
};
