const deploy = require("../../lib/actions/deploy");

const slack_bot_event = require("../../lib/slack_bot_event");

const session_factory = require("../../lib/conversation/session");
const deployment_factory = require("../../lib/conversation/deployment");

const stream_factory = require("../../lib/stream");
const pipeline_factory = require("../../lib/pipeline");

const document_store_factory = require("../infra/document_store");
const secret_store_factory = require("../infra/secret_store");
const message_store_factory = require("../infra/message_store");
const job_store_factory = require("../infra/job_store");

const i18n_factory = require("../i18n");

test("deploy elm", async () => {
  const struct = init_struct({
    deploy_error: null,
  });

  const action = deploy.init(struct);

  await action.perform();

  expect(struct.message_store.data.post.length).toBe(0);
  expect(struct.message_store.data.add.length).toBe(1);
  expect(JSON.stringify(struct.message_store.data.add[0])).toBe(JSON.stringify({
    token: "MESSAGE-TOKEN",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    name: "success",
  }));

  expect(struct.job_store.data.deploy.length).toBe(1);
  expect(JSON.stringify(struct.job_store.data.deploy[0])).toBe(JSON.stringify({
    project_id: "PROJECT-ID",
    token: "TOKEN",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  }));
});

test("deploy error", async () => {
  const struct = init_struct({
    deploy_error: "deploy-error",
  });

  const action = deploy.init(struct);

  await action.perform();

  expect(struct.message_store.data.post.length).toBe(0);
  expect(struct.message_store.data.add.length).toBe(1);
  expect(JSON.stringify(struct.message_store.data.add[0])).toBe(JSON.stringify({
    token: "MESSAGE-TOKEN",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    name: "failure",
  }));

  expect(struct.job_store.data.deploy.length).toBe(0);
});

const init_struct = ({deploy_error}) => {
  const secret_store = secret_store_factory.init({
    message_token: "MESSAGE-TOKEN",
    job_tokens: {
      elm: {project_id: "PROJECT-ID", token: "TOKEN"},
    },
  });
  const message_store = message_store_factory.init();
  const job_store = job_store_factory.init({
    deploy_error,
  });

  const session = session_factory.init({
    document_store: document_store_factory.init({
      put: false,
    }),
  });
  const deployment = deployment_factory.init({
    secret_store,
  });

  const i18n = i18n_factory.init();

  const conversation = slack_bot_event.parse({
    raw_event: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "deploy elm",
    },
    repository: {
      session,
      deployment,
    },
    i18n,
  });

  const repository = {
    stream: stream_factory.init({
      secret_store,
      message_store,
    }),
    pipeline: pipeline_factory.init({
      secret_store,
      job_store,
    }),
  };

  return {
    conversation,
    repository,
    i18n,
    message_store,
    job_store,
  };
};
