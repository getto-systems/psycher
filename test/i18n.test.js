const i18n_factory = require("../lib/i18n");

test("check i18n struct", async () => {
  i18n_factory.languages.forEach((lang) => {
    const i18n = i18n_factory.init(lang);
    expect(!!i18n.action.deploy.success).toBe(true);
    expect(!!i18n.action.deploy.failure).toBe(true);
    expect(!!i18n.action.deploy_target_not_found.messages).toBe(true);
    expect(!!i18n.action.greeting.messages).toBe(true);
    expect(!!i18n.action.unknown_mention.messages).toBe(true);
    expect(!!i18n.conversation.words.deploy).toBe(true);
    expect(!!i18n.conversation.words.greeting).toBe(true);
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
