const conversation_factory = require("../lib/conversation");
const progress = require("../lib/conversation/progress");
const reply = require("../lib/conversation/reply");
const job = require("../lib/conversation/job");

const session_factory = require("../lib/session");
const deployment_factory = require("../lib/deployment");

const stream_factory = require("../lib/stream");
const pipeline_factory = require("../lib/pipeline");

const document_store_factory = require("./infra/document_store");
const secret_store_factory = require("./infra/secret_store");
const message_store_factory = require("./infra/message_store");
const job_store_factory = require("./infra/job_store");

test("init conversation", async () => {
  const {factory, message_store, job_store} = init_factory();

  const conversation = conversation_factory.init({
    event_info: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text: "deploy elm",
    },
    factory,
  });

  expect(conversation.includes("deploy")).toBe(true);
  expect(conversation.includes_some(["deploy"])).toBe(true);

  expect(await conversation.is_already_started()).toBe(false);
  expect(await conversation.has_no_deploy_target()).toBe(false);
});

test("nothing effect on double is_already_started check", async () => {
  const {factory, message_store, job_store} = init_factory();

  const conversation = conversation_factory.init({
    event_info: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text: "deploy elm",
    },
    factory,
  });

  expect(await conversation.is_already_started()).toBe(false);
  expect(await conversation.is_already_started()).toBe(false);
});

test("reply message", async () => {
  const {factory, message_store, job_store} = init_factory();

  const conversation = conversation_factory.init({
    event_info: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text: "deploy elm",
    },
    factory,
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
  const {factory, message_store, job_store} = init_factory();

  const conversation = conversation_factory.init({
    event_info: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text: "deploy elm",
    },
    factory,
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
  const {factory, message_store, job_store} = init_factory();

  const conversation = conversation_factory.init({
    event_info: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text: "deploy elm",
    },
    factory,
  });

  await conversation.trigger_deploy_job();

  expect(job_store.data.deploy.length).toBe(1);
  expect(JSON.stringify(job_store.data.deploy[0])).toBe(JSON.stringify({
    job_token: {
      project_id: "ELM-PROJECT-ID",
      token: "ELM-TOKEN",
    },
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
  }));

  expect(message_store.data.post.length).toBe(0);
  expect(message_store.data.add.length).toBe(0);
});

const init_factory = () => {
  const secret_store = secret_store_factory.init({
    message_token: "MESSAGE-TOKEN",
    job_targets: ["elm"],
    job_token: {project_id: "ELM-PROJECT-ID", token: "ELM-TOKEN"},
  });
  const message_store = message_store_factory.init();
  const job_store = job_store_factory.init({
    deploy_error: null,
  });

  const session = session_factory.init({
    document_store: document_store_factory.init({
      put_error: null,
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

  const repository = {
    session,
    deployment,
    stream,
    pipeline,
  };

  const factory = {
    progress: progress.init({
      session: repository.session,
    }),
    reply: reply.init({
      stream: repository.stream,
    }),
    job: job.init({
      deployment: repository.deployment,
      pipeline: repository.pipeline,
    }),
  };

  return {
    factory,
    message_store,
    job_store,
  };
};
