const AWS = require("aws-sdk");

exports.get = (env) => get(env);

/**
 * env : {
 *   region: aws region
 *   secret_id: secret id : see aws secret manager
 * }
 */
const get = (env) => {
  return new Promise((resolve, reject) => {
    new AWS.SecretsManager({
      region: env.region,
    }).getSecretValue({SecretId: env.secret_id}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data.SecretString));
      }
    });
  });
};
