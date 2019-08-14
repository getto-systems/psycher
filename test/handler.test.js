const handler = require("../lib/handler");

const i18n = require("./i18n");

test("init event type handler", async () => {
  handler.event_types().forEach((type) => {
    handler.init({type, i18n: i18n.init()});
  });
});

test("unknown type", async () => {
  try {
    handler.init({type: "unknown"});

    throw "unknown handler error not throwed";
  } catch (e) {
    expect(e).toBe("unknown event type: unknown");
  }
});
