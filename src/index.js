const AWS = require('aws-sdk');

exports.handler = async (event) => {
  const secret = await get_secret_value();
  console.log("ddd");
  console.log(secret);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "hello, world!",
    }),
  };
};

const get_secret_value = () => {
  return new Promise((resolve) => {
    const region = process.env.REGION;
    const secretId = process.env.SECRET_ID;

    new AWS.SecretsManager({
      region: region,
    }).getSecretValue({SecretId: secretId}, function(err, data) {
      if (err) {
        throw err;
      }

      resolve(JSON.parse(data.SecretString));
    });
  });
};
