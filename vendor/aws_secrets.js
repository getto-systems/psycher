const AWS = require("aws-sdk");

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   region: aws region
 *   secret_id: secret id : see aws secrets manager
 * }
 *
 * returns {
 *   getJSON: async () => get secret string value as json
 * }
 */
const init = ({region, secret_id}) => {
  const getJSON = async () => {
    const data = await load();
    return JSON.parse(data.SecretString);
  };

  const load = () => {
    return new Promise((resolve, reject) => {
      new AWS.SecretsManager({
        region: region,
      }).getSecretValue({SecretId: secret_id}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  return {
    getJSON,
  };
};
