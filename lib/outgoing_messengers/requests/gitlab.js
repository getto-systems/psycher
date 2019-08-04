const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

exports.trigger = (info, secret) => trigger(info, secret);

/**
 * info : request type (string)
 * secret : secrets/gitlab
 */
const trigger = async (info, {channel, timestamp, project_id, trigger_token}) => {
  console.log("gitlab trigger : " + info);

  const url = "https://gitlab.com/api/v4/projects/" + project_id + "/trigger/pipeline";

  const body = new URLSearchParams();
  body.append("token", trigger_token);
  body.append("ref", "master");
  body.append("variables[RELEASE]", "true");
  body.append("variables[channel]", channel);
  body.append("variables[timestamp]", timestamp);

  const response = await fetch(url, {
    method: "POST",
    body,
  });

  console.log("response code: " + response.status);
};
