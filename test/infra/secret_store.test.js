const secret_store = require("../../lib/infra/secret_store");

test("message_token", async () => {
  const aws_secrets = init_aws_secrets({
    "slack-bot-token": "SLACK_BOT_TOKEN",
  });

  const store = secret_store.init({
    aws_secrets,
  });

  const token = await store.message_token();

  expect(token).toBe("SLACK_BOT_TOKEN");
});

test("job_tokens", async () => {
  const aws_secrets = init_aws_secrets({
    "gitlab-trigger-tokens": JSON.stringify({
      "TEAM": {
        "CHANNEL": {
          elm: {project_id: "ELM-PROJECT-ID", token: "ELM-TOKEN"},
          rails: {project_id: "RAILS-PROJECT-ID", token: "RAILS-TOKEN"},
        },
      },
    }),
  });

  const store = secret_store.init({
    aws_secrets,
  });

  const tokens = await store.job_tokens({team: "TEAM", channel: "CHANNEL"});

  expect(JSON.stringify(tokens)).toBe(JSON.stringify({
    elm: {project_id: "ELM-PROJECT-ID", token: "ELM-TOKEN"},
    rails: {project_id: "RAILS-PROJECT-ID", token: "RAILS-TOKEN"},
  }));

  const unknown_tokens = await store.job_tokens({team: "UNKNOWN", channel: "CHANNEL"});

  expect(unknown_tokens).toBe(null);
});

const init_aws_secrets = (struct) => {
  const getJSON = async () => {
    return struct;
  };

  return {
    getJSON,
  };
};
