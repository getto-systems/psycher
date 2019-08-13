const secret_store = require("../../lib/infra/secret_store");

test("message_token", async () => {
  const {store, aws_secrets} = init_secret_store({
    "slack-bot-token": "SLACK_BOT_TOKEN",
  });

  const token = await store.message_token();

  expect(token).toBe("SLACK_BOT_TOKEN");
});

test("job_targets", async () => {
  const {store, aws_secrets} = init_secret_store({
    "gitlab-trigger-tokens": JSON.stringify({
      "TEAM": {
        "CHANNEL": {
          elm: {project_id: "ELM-PROJECT-ID", token: "ELM-TOKEN"},
          rails: {project_id: "RAILS-PROJECT-ID", token: "RAILS-TOKEN"},
        },
      },
    }),
  });

  const targets = await store.job_targets({team: "TEAM", channel: "CHANNEL"});
  expect(targets).toEqual(["elm", "rails"]);

  const unknown_targets = await store.job_targets({team: "UNKNOWN", channel: "CHANNEL"});
  expect(unknown_targets).toEqual([]);
});

test("job_token", async () => {
  const {store, aws_secrets} = init_secret_store({
    "gitlab-trigger-tokens": JSON.stringify({
      "TEAM": {
        "CHANNEL": {
          elm: {project_id: "ELM-PROJECT-ID", token: "ELM-TOKEN"},
          rails: {project_id: "RAILS-PROJECT-ID", token: "RAILS-TOKEN"},
          no_project_id: {project: "INVALID", token: "TOKEN"},
          no_token: {project_id: "INVALID", trigger_token: "TOKEN"},
        },
      },
    }),
  });

  const job_signature = {
    team: "TEAM",
    channel: "CHANNEL",
  };

  const elm_token = await store.job_token({job_signature, target: "elm"});
  expect(elm_token).toEqual({project_id: "ELM-PROJECT-ID", token: "ELM-TOKEN"});

  const rails_token = await store.job_token({job_signature, target: "rails"});
  expect(rails_token).toEqual({project_id: "RAILS-PROJECT-ID", token: "RAILS-TOKEN"});

  const no_project_id_token = await store.job_token({job_signature, target: "no_project_id"});
  expect(no_project_id_token).toBe(null);

  const no_token_token = await store.job_token({job_signature, target: "no_token"});
  expect(no_token_token).toBe(null);

  const unknown_target = await store.job_token({job_signature, target: "unknown"});
  expect(unknown_target).toBe(null);
});

test("job_token with unknown team", async () => {
  const {store, aws_secrets} = init_secret_store({
    "gitlab-trigger-tokens": JSON.stringify({
      "TEAM": {
        "CHANNEL": {
          elm: {project_id: "ELM-PROJECT-ID", token: "ELM-TOKEN"},
          rails: {project_id: "RAILS-PROJECT-ID", token: "RAILS-TOKEN"},
          no_project_id: {project: "INVALID", token: "TOKEN"},
          no_token: {project_id: "INVALID", trigger_token: "TOKEN"},
        },
      },
    }),
  });

  const job_signature = {
    team: "unknown",
    channel: "CHANNEL",
  };

  const elm_token = await store.job_token({job_signature, target: "elm"});
  expect(elm_token).toBe(null);
});

const init_secret_store = (struct) => {
  const aws_secrets = init_aws_secrets(struct);

  const store = secret_store.init({
    aws_secrets,
  });

  return {
    store,
    aws_secrets,
  };
};

const init_aws_secrets = (struct) => {
  const getJSON = async () => {
    return struct;
  };

  return {
    getJSON,
  };
};
