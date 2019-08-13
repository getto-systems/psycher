const handler = require("../../lib/handlers/app_mention");

const conversation_factory = require("../../lib/conversation");
const progress = require("../../lib/conversation/progress");
const reply = require("../../lib/conversation/reply");

const session_factory = require("../../lib/session");
const deployment_factory = require("../../lib/deployment");

const stream_factory = require("../../lib/stream");
const pipeline_factory = require("../../lib/pipeline");

const document_store_factory = require("../infra/document_store");
const secret_store_factory = require("../infra/secret_store");
const message_store_factory = require("../infra/message_store");
const job_store_factory = require("../infra/job_store");

const i18n_factory = require("../i18n");

test("deploy elm", async () => {
  const {struct, message_store, job_store} = init_struct({
    put_error: null,
    deploy_error: null,
    type: "app_mention",
    text: "deploy elm",
  });

  await handler.operate(struct);

  expect(message_store.data.post.length).toBe(0);
  expect(message_store.data.add.length).toBe(1);
  expect(JSON.stringify(message_store.data.add[0])).toBe(JSON.stringify({
    token: "MESSAGE-TOKEN",
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    name: "success",
  }));

  expect(job_store.data.deploy.length).toBe(1);
  expect(JSON.stringify(job_store.data.deploy[0])).toBe(JSON.stringify({
    project_id: "ELM-PROJECT-ID",
    token: "ELM-TOKEN",
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
  }));
});

test("deploy error", async () => {
  const {struct, message_store, job_store} = init_struct({
    put_error: null,
    deploy_error: "deploy-error",
    type: "app_mention",
    text: "deploy elm",
  });

  await handler.operate(struct);

  expect(message_store.data.post.length).toBe(0);
  expect(message_store.data.add.length).toBe(1);
  expect(JSON.stringify(message_store.data.add[0])).toBe(JSON.stringify({
    token: "MESSAGE-TOKEN",
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    name: "failure",
  }));

  expect(job_store.data.deploy.length).toBe(0);
});

test("deploy target not found", async () => {
  const {struct, message_store, job_store} = init_struct({
    put_error: null,
    deploy_error: null,
    type: "app_mention",
    text: "deploy unknown",
  });

  await handler.operate(struct);

  expect(message_store.data.post.length).toBe(1);
  expect(JSON.stringify(message_store.data.post[0])).toBe(JSON.stringify({
    token: "MESSAGE-TOKEN",
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    text: "deploy_target_not_found",
  }));

  expect(message_store.data.add.length).toBe(0);

  expect(job_store.data.deploy.length).toBe(0);
});

test("greeting", async () => {
  const {struct, message_store, job_store} = init_struct({
    put_error: null,
    deploy_error: null,
    type: "app_mention",
    text: "hello",
  });

  await handler.operate(struct);

  expect(message_store.data.post.length).toBe(1);
  expect(JSON.stringify(message_store.data.post[0])).toBe(JSON.stringify({
    token: "MESSAGE-TOKEN",
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    text: "greeting",
  }));

  expect(message_store.data.add.length).toBe(0);

  expect(job_store.data.deploy.length).toBe(0);
});

test("unknown mention", async () => {
  const {struct, message_store, job_store} = init_struct({
    put_error: null,
    deploy_error: null,
    type: "app_mention",
    text: "unknown",
  });

  await handler.operate(struct);

  expect(message_store.data.post.length).toBe(1);
  expect(JSON.stringify(message_store.data.post[0])).toBe(JSON.stringify({
    token: "MESSAGE-TOKEN",
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    text: "unknown_mention",
  }));

  expect(message_store.data.add.length).toBe(0);

  expect(job_store.data.deploy.length).toBe(0);
});

test("do not duplicate deploy", async () => {
  const {struct, message_store, job_store} = init_struct({
    put_error: "put error",
    deploy_error: null,
    type: "app_mention",
    text: "deploy elm",
  });

  await handler.operate(struct);

  expect(message_store.data.post.length).toBe(0);
  expect(message_store.data.add.length).toBe(0);
  expect(job_store.data.deploy.length).toBe(0);
});

const init_struct = ({put_error, type, deploy_error, text}) => {
  const {repository, factory, message_store, job_store} = init_repository({
    put_error,
    deploy_error,
  });

  const conversation = conversation_factory.init({
    event_info: {
      type,
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      text,
    },
    repository,
    factory,
  });

  const i18n = i18n_factory.init();

  return {
    struct: {
      conversation,
      i18n: i18n.app_mention,
    },
    message_store,
    job_store,
  };
};

const init_repository = ({put_error, deploy_error}) => {
  const secret_store = secret_store_factory.init({
    message_token: "MESSAGE-TOKEN",
    job_tokens: {
      elm: {project_id: "ELM-PROJECT-ID", token: "ELM-TOKEN"},
      rails: {project_id: "RAILS-PROJECT-ID", token: "RAILS-TOKEN"},
    },
  });
  const message_store = message_store_factory.init();
  const job_store = job_store_factory.init({
    deploy_error,
  });

  const session = session_factory.init({
    document_store: document_store_factory.init({
      put_error,
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

  const factory = init_factory(repository);

  return {
    repository,
    factory,
    message_store,
    job_store,
  };
};

const init_factory = (repository) => {
  return {
    progress: progress.init({
      session: repository.session,
    }),
    reply: reply.init({
      stream: repository.stream,
    }),
  };
};
