const deployment_factory = require("../../lib/conversation/deployment");

const secret_store_factory = require("../infra/secret_store");

test("select target from only one target", async () => {
  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {},
      },
    }),
  });

  const target = await deployment.target({
    team: "TEAM",
    channel: "CHANNEL",
    text: "release",
  });

  expect(target).toBe("elm");
});

test("select target from multiple targets", async () => {
  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {},
        rails: {},
      },
    }),
  });

  const target = await deployment.target({
    team: "TEAM",
    channel: "CHANNEL",
    text: "release elm",
  });

  expect(target).toBe("elm");
});

test("select first target from multiple targets", async () => {
  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {},
        rails: {},
      },
    }),
  });

  const target = await deployment.target({
    team: "TEAM",
    channel: "CHANNEL",
    text: "release rails elm",
  });

  expect(target).toBe("elm");
});

test("select failed from multiple targets", async () => {
  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {},
        rails: {},
      },
    }),
  });

  const target = await deployment.target({
    team: "TEAM",
    channel: "CHANNEL",
    text: "release unknown",
  });

  expect(target).toBe(null);
});

test("select failed from no targets", async () => {
  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: null,
    }),
  });

  const target = await deployment.target({
    team: "TEAM",
    channel: "CHANNEL",
    text: "release unknown",
  });

  expect(target).toBe(null);
});
