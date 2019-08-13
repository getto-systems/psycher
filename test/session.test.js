const session_factory = require("../lib/session");

const document_store_factory = require("./infra/document_store");

test("start", async () => {
  const session = session_factory.init({
    document_store: document_store_factory.init({
      put_error: null,
    }),
  });

  await session.start({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  });
});
