const noop = require("../../lib/actions/noop");

test("noop", async () => {
  const action = noop.init();

  const result = await action.perform();

  expect(result).toBe(null);
});
