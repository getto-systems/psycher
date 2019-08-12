const pipeline_factory = require("../lib/pipeline");

const secret_store_factory = require("./infra/secret_store");
const job_store_factory = require("./infra/job_store");

test("trigger", async () => {
  const job_store = job_store_factory.init({
    deploy_error: null,
  });

  const pipeline = pipeline_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {project_id: "PROJECT-ID", token: "TOKEN"},
      },
    }),
    job_store,
  });

  await pipeline.trigger({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    target: "elm",
  });

  expect(job_store.data.deploy.length).toBe(1);
  expect(JSON.stringify(job_store.data.deploy[0])).toBe(JSON.stringify({
    project_id: "PROJECT-ID",
    token: "TOKEN",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  }));
});

test("trigger unknown target", async () => {
  const job_store = job_store_factory.init({
    deploy_error: null,
  });

  const pipeline = pipeline_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {project_id: "PROJECT-ID", token: "TOKEN"},
      },
    }),
    job_store,
  });

  try {
    await pipeline.trigger({
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      target: "unknown",
    });

    throw "unknown token error not throwed";
  } catch (e) {
    expect(e).toBe("job token not found");
  }
});

test("trigger invalid project_id", async () => {
  const job_store = job_store_factory.init({
    deploy_error: null,
  });

  const pipeline = pipeline_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {project: "PROJECT-ID", token: "TOKEN"},
      },
    }),
    job_store,
  });

  try {
    await pipeline.trigger({
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      target: "elm",
    });

    throw "unknown token error not throwed";
  } catch (e) {
    expect(e).toBe("job token not found");
  }
});

test("trigger invalid token", async () => {
  const job_store = job_store_factory.init({
    deploy_error: null,
  });

  const pipeline = pipeline_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens: {
        elm: {project_id: "PROJECT-ID", trigger_token: "TOKEN"},
      },
    }),
    job_store,
  });

  try {
    await pipeline.trigger({
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
      target: "elm",
    });

    throw "unknown token error not throwed";
  } catch (e) {
    expect(e).toBe("job token not found");
  }
});
