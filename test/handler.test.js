const handler_factory = require("../lib/handler");

test("init event type handler", async () => {
  handler_factory.handlers().forEach((type) => {
    handler_factory.init(type);
  });
});

test("unknown type", async () => {
  try {
    handler_factory.init("unknown");

    throw "unknown handler error not throwed";
  } catch (e) {
    expect(e).toBe("unknown event type: unknown");
  }
});
