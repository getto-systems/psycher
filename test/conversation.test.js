const conversation_factory = require("../lib/conversation");

const session_factory = require("../lib/session");
const deployment_factory = require("../lib/deployment");

const stream_factory = require("../lib/stream");
const pipeline_factory = require("../lib/pipeline");

const document_store_factory = require("./infra/document_store");
const secret_store_factory = require("./infra/secret_store");
const message_store_factory = require("./infra/message_store");
const job_store_factory = require("./infra/job_store");

test("init conversation", async () => {
  const {repository, message_store, job_store} = init_repository();

  const conversation = conversation_factory.init({
    event_info: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text: "deploy elm",
    },
    repository,
  });

  expect(conversation.is_mention()).toBe(true);
  expect(conversation.includes("deploy")).toBe(true);

  expect(await conversation.is_already_started()).toBe(false);
  expect(await conversation.is_deploy_target_detected()).toBe(true);
});

test("unknown event type", async () => {
  const {repository, message_store, job_store} = init_repository();

  const conversation = conversation_factory.init({
    event_info: {
      type: "unknown",
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text: "deploy elm",
    },
    repository,
  });

  expect(conversation.is_mention()).toBe(false);
});

test("reply message", async () => {
  const {repository, message_store, job_store} = init_repository();

  const conversation = conversation_factory.init({
    event_info: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text: "deploy elm",
    },
    repository,
  });

  await conversation.reply(["message"]);

  expect(message_store.data.post.length).toBe(1);
  expect(JSON.stringify(message_store.data.post[0])).toBe(JSON.stringify({
    token: "MESSAGE-TOKEN",
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    text: "message",
  }));

  expect(message_store.data.add.length).toBe(0);
  expect(job_store.data.deploy.length).toBe(0);
});

test("add reaction", async () => {
  const {repository, message_store, job_store} = init_repository();

  const conversation = conversation_factory.init({
    event_info: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text: "deploy elm",
    },
    repository,
  });

  await conversation.reaction("reaction");

  expect(message_store.data.add.length).toBe(1);
  expect(JSON.stringify(message_store.data.add[0])).toBe(JSON.stringify({
    token: "MESSAGE-TOKEN",
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    name: "reaction",
  }));

  expect(message_store.data.post.length).toBe(0);
  expect(job_store.data.deploy.length).toBe(0);
});

test("trigger deploy job", async () => {
  const {repository, message_store, job_store} = init_repository();

  const conversation = conversation_factory.init({
    event_info: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text: "deploy elm",
    },
    repository,
  });

  await conversation.trigger_deploy_job();

  expect(job_store.data.deploy.length).toBe(1);
  expect(JSON.stringify(job_store.data.deploy[0])).toBe(JSON.stringify({
    project_id: "ELM-PROJECT-ID",
    token: "ELM-TOKEN",
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
  }));

  expect(message_store.data.post.length).toBe(0);
  expect(message_store.data.add.length).toBe(0);
});

const init_repository = () => {
  const secret_store = secret_store_factory.init({
    message_token: "MESSAGE-TOKEN",
    job_tokens: {
      elm: {project_id: "ELM-PROJECT-ID", token: "ELM-TOKEN"},
      rails: {project_id: "RAILS-PROJECT-ID", token: "RAILS-TOKEN"},
    },
  });
  const message_store = message_store_factory.init();
  const job_store = job_store_factory.init({
    deploy_error: null,
  });

  const session = session_factory.init({
    document_store: document_store_factory.init({
      put: true,
    }),
  });
  const deployment = deployment_factory.init({
    secret_store,
  });

  const stream = stream_factory.init({
    secret_store,
    message_store,
  });
  const pipeline = pipeline_factory.init({
    secret_store,
    job_store,
  });

  return {
    repository: {
      session,
      deployment,
      stream,
      pipeline,
    },
    message_store,
    job_store,
  };
};
