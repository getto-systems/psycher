const session_factory = require("../../lib/conversation/session");

const document_store_factory = require("../infra/document_store");

test("is_already_started returns true", async () => {
  const session = session_factory.init({
    document_store: document_store_factory.init({
      put: false,
    }),
  });

  const result = await session.is_already_started({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  });

  expect(result).toBe(true);
});

test("is_already_started returns false", async () => {
  const session = session_factory.init({
    document_store: document_store_factory.init({
      put: true,
    }),
  });

  const result = await session.is_already_started({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  });

  expect(result).toBe(false);
});
