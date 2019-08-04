const AWS = require("aws-sdk");

exports.get = (struct) => get(struct);

/**
 * struct : {
 *   region: aws region
 *   secret_id: secret id : see aws secret manager
 * }
 */
const get = ({region, secret_id}) => {
  return new Promise((resolve, reject) => {
    new AWS.SecretsManager({
      region: region,
    }).getSecretValue({SecretId: secret_id}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data.SecretString));
      }
    });
  });
};
