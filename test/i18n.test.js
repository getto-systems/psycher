const i18n_factory = require("../lib/i18n");
const handler_factory = require("../lib/handler");

test("check i18n struct", async () => {
  i18n_factory.languages().forEach((lang) => {
    const i18n = i18n_factory.init(lang);

    const handler_tests = {
      mention: (target) => {
        expect(target.deploy.words).toBeTruthy();
        expect(target.deploy.success).toBeTruthy();
        expect(target.deploy.failure).toBeTruthy();
        expect(target.deploy_target_not_found.messages).toBeTruthy();
        expect(target.greeting.words).toBeTruthy();
        expect(target.greeting.messages).toBeTruthy();
        expect(target.unknown_mention.messages).toBeTruthy();
      },
    };

    handler_factory.handler_names().forEach((name) => {
      handler_tests[name](i18n[name]);
    });
  });
});

test("unknown language", async () => {
  expect(() => {
    i18n_factory.init("unknown");
  }).toThrow("unknown language: unknown");
});
