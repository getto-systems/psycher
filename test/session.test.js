const session_factory = require("../lib/session");

const uuid_store_factory = require("./infra/uuid_store");
const document_store_factory = require("./infra/document_store");

test("started_conversations exists", async () => {
  const session = init_session({
    started_conversations_exists: true,
  });

  const result = await session.is_not_started({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  });

  expect(result).toBe(true);
});

test("started_conversations not exists", async () => {
  const session = init_session({
    started_conversations_exists: false,
  });

  const result = await session.is_not_started({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  });

  expect(result).toBe(false);
});

test("generate uuid", async () => {
  const session = init_session({
    started_conversations_exists: true,
  });

  const result = await session.generate_uuid();

  expect(result).toBe("UUID");
});

const init_session = ({started_conversations_exists}) => {
  return session_factory.init({
    uuid_store: uuid_store_factory.init({
      uuid: "UUID",
    }),
    document_store: document_store_factory.init({
      started_conversations_exists,
    }),
  });
};
