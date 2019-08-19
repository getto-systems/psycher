const handler = require("../lib/handler");

const i18n = require("./i18n");

test("all action condition failed", async () => {
  await expect(handler.perform([
    {
      condition: {
        matches: async () => false,
      },
    },
  ])).resolves.toBe(null);
});

test("unknown type", async () => {
  expect(() => {
    handler.detect_actions({
      type: "unknown",
    })
  }).toThrow("unknown event type: unknown");
});
