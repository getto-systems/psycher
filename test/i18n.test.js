const i18n_factory = require("../lib/i18n");
const handler_factory = require("../lib/handler");

test("check i18n struct", async () => {
  i18n_factory.languages().forEach((lang) => {
    const i18n = i18n_factory.init(lang);

    const handler_tests = {
      mention: (target) => {
        expect(!!target.deploy.words).toBe(true);
        expect(!!target.deploy.success).toBe(true);
        expect(!!target.deploy.failure).toBe(true);
        expect(!!target.deploy_target_not_found.messages).toBe(true);
        expect(!!target.greeting.words).toBe(true);
        expect(!!target.greeting.messages).toBe(true);
        expect(!!target.unknown_mention.messages).toBe(true);
      },
    };

    handler_factory.handler_names().forEach((name) => {
      handler_tests[name](i18n[name]);
    });
  });
});

test("unknown language", async () => {
  try {
    i18n_factory.init("unknown");

    throw "unknown language error not throwed";
  } catch (e) {
    expect(e).toBe("unknown language: unknown");
  }
});
