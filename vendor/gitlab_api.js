const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

exports.init = () => init();

/**
 * returns {
 *   trigger: async (struct) => trigger gitlab pipeline
 * }
 */
const init = () => {
  /**
   * struct : {
   *   project_id : gitlab project id
   *   token : gitlab trigger token
   *   ref : trigger ref
   *   variables : trigger variables : { "KEY": "VALUE" }
   * }
   */
  const trigger = ({project_id, token, ref, variables}) => {
    const url = "https://gitlab.com/api/v4/projects/" + project_id + "/trigger/pipeline";

    const body = new URLSearchParams();
    body.append("token", token);
    body.append("ref", ref);

    Object.keys(variables).forEach((key) => {
      body.append("variables[" + key + "]", variables[key]);
    });

    return fetch(url, {
      method: "POST",
      body,
    });
  };

  return {
    trigger,
  };
};
