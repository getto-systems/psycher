const i18n_factory = require("../lib/i18n");
const handler_factory = require("../lib/handler");

test("check i18n struct", async () => {
  i18n_factory.languages().forEach((lang) => {
    const i18n = i18n_factory.init(lang);

    const handler_tests = {
      app_mention: (target) => {
        expect(!!target.action.deploy.success).toBe(true);
        expect(!!target.action.deploy.failure).toBe(true);
        expect(!!target.action.deploy_target_not_found.messages).toBe(true);
        expect(!!target.action.greeting.messages).toBe(true);
        expect(!!target.action.unknown_mention.messages).toBe(true);
        expect(!!target.conversation.words.deploy).toBe(true);
        expect(!!target.conversation.words.greeting).toBe(true);
      },
    };

    handler_factory.handlers().forEach((type) => {
      handler_tests[type](i18n[type]);
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
