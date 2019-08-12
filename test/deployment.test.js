const deployment_factory = require("../lib/deployment");

const secret_store_factory = require("./infra/secret_store");

test("select target from only one target", async () => {
  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {},
      },
    }),
  });

  const target = await deployment.target({
    job_signature: {
      team: "TEAM",
      channel: "CHANNEL",
    },
    includes: (word) => "release".includes(word),
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
    job_signature: {
      team: "TEAM",
      channel: "CHANNEL",
    },
    includes: (word) => "release elm".includes(word),
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
    job_signature: {
      team: "TEAM",
      channel: "CHANNEL",
    },
    includes: (word) => "release rails elm".includes(word),
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
    job_signature: {
      team: "TEAM",
      channel: "CHANNEL",
    },
    includes: (word) => "release unknown".includes(word),
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
    job_signature: {
      team: "TEAM",
      channel: "CHANNEL",
    },
    includes: (word) => "release unknown".includes(word),
  });

  expect(target).toBe(null);
});
