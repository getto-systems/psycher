const slack_bot_event = require("../lib/slack_bot_event");

const session_factory = require("../lib/conversation/session");
const deployment_factory = require("../lib/conversation/deployment");

const document_store_factory = require("./infra/document_store");
const secret_store_factory = require("./infra/secret_store");

const i18n_factory = require("./i18n");

test("deploy elm", async () => {
  const session = session_factory.init({
    document_store: document_store_factory.init({
      put: false,
    }),
  });

  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {},
        rails: {},
      },
    }),
  });

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
    i18n: i18n_factory.init(),
  });

  expect(conversation.team).toBe("TEAM");
  expect(conversation.channel).toBe("CHANNEL");
  expect(conversation.timestamp).toBe("TIMESTAMP");
  expect(conversation.text).toBe("deploy elm");

  expect(conversation.is_deploy()).toBe(true);
  expect(await conversation.has_deploy_target()).toBe(true);
  expect(await conversation.deploy_target()).toBe("elm");

  expect(conversation.is_greeting()).toBe(false);
  expect(conversation.is_mention()).toBe(true);
});

test("unknown deploy target", async () => {
  const session = session_factory.init({
    document_store: document_store_factory.init({
      put: false,
    }),
  });

  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {},
        rails: {},
      },
    }),
  });

  const conversation = slack_bot_event.parse({
    raw_event: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "deploy unknown",
    },
    repository: {
      session,
      deployment,
    },
    i18n: i18n_factory.init(),
  });

  expect(conversation.is_deploy()).toBe(true);
  expect(await conversation.has_deploy_target()).toBe(false);
  expect(await conversation.deploy_target()).toBe(null);

  expect(conversation.is_greeting()).toBe(false);
  expect(conversation.is_mention()).toBe(true);
});

test("greeting", async () => {
  const session = session_factory.init({
    document_store: document_store_factory.init({
      put: false,
    }),
  });

  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {},
        rails: {},
      },
    }),
  });

  const conversation = slack_bot_event.parse({
    raw_event: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "hello",
    },
    repository: {
      session,
      deployment,
    },
    i18n: i18n_factory.init(),
  });

  expect(conversation.is_deploy()).toBe(false);
  expect(await conversation.has_deploy_target()).toBe(false);
  expect(await conversation.deploy_target()).toBe(null);

  expect(conversation.is_greeting()).toBe(true);
  expect(conversation.is_mention()).toBe(true);
});

test("unknown mention", async () => {
  const session = session_factory.init({
    document_store: document_store_factory.init({
      put: false,
    }),
  });

  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {},
        rails: {},
      },
    }),
  });

  const conversation = slack_bot_event.parse({
    raw_event: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "unknown message",
    },
    repository: {
      session,
      deployment,
    },
    i18n: i18n_factory.init(),
  });

  expect(conversation.is_deploy()).toBe(false);
  expect(await conversation.has_deploy_target()).toBe(false);
  expect(await conversation.deploy_target()).toBe(null);

  expect(conversation.is_greeting()).toBe(false);
  expect(conversation.is_mention()).toBe(true);
});

test("unknown event", async () => {
  const session = session_factory.init({
    document_store: document_store_factory.init({
      put: false,
    }),
  });

  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {},
        rails: {},
      },
    }),
  });

  const conversation = slack_bot_event.parse({
    raw_event: {
      type: "unknown",
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "unknown message",
    },
    repository: {
      session,
      deployment,
    },
    i18n: i18n_factory.init(),
  });

  expect(conversation.is_deploy()).toBe(false);
  expect(await conversation.has_deploy_target()).toBe(false);
  expect(await conversation.deploy_target()).toBe(null);

  expect(conversation.is_greeting()).toBe(false);
  expect(conversation.is_mention()).toBe(false);
});
