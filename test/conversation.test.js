const conversation_factory = require("../lib/conversation");

const session_factory = require("../lib/conversation/progress/session");

const deployment_factory = require("../lib/conversation/job/deployment");
const pipeline_factory = require("../lib/conversation/job/pipeline");

const stream_factory = require("../lib/conversation/message/stream");

const uuid_store_factory = require("./infra/uuid_store");
const document_store_factory = require("./infra/document_store");
const secret_store_factory = require("./infra/secret_store");
const message_store_factory = require("./infra/message_store");
const job_store_factory = require("./infra/job_store");

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

  expect(message_store.data).toEqual({
    post: [
      {
        token: "MESSAGE-TOKEN",
        reply_to: {
          channel: "CHANNEL",
          timestamp: "TIMESTAMP",
        },
        text: "message",
      },
    ],
    add: [],
  });
  expect(job_store.data).toEqual({
    deploy: [],
  });
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

  expect(message_store.data).toEqual({
    post: [],
    add: [
      {
        token: "MESSAGE-TOKEN",
        reply_to: {
          channel: "CHANNEL",
          timestamp: "TIMESTAMP",
        },
        name: "reaction",
      },
    ],
  });
  expect(job_store.data).toEqual({
    deploy: [],
  });
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

  expect(message_store.data).toEqual({
    post: [],
    add: [],
  });
  expect(job_store.data).toEqual({
    deploy: [
      {
        job_token: {
          project_id: "ELM-PROJECT-ID",
          token: "ELM-TOKEN",
        },
        reply_to: {
          channel: "CHANNEL",
          timestamp: "TIMESTAMP",
        },
      },
    ],
  });
});

const init_repository = () => {
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
    uuid_store: uuid_store_factory.init({
      uuid: "UUID",
    }),
    document_store: document_store_factory.init({
      started_conversations_exists: true,
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

  return {
    repository,
    message_store,
    job_store,
  };
};
