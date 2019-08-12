const pipeline_factory = require("../lib/pipeline");

const secret_store_factory = require("./infra/secret_store");
const job_store_factory = require("./infra/job_store");

test("deploy", async () => {
  const {pipeline, job_store} = init_pipeline({
    job_tokens: {
      elm: {project_id: "PROJECT-ID", token: "TOKEN"},
    },
  });

  await pipeline.deploy({
    job_signature: {
      team: "TEAM",
      channel: "CHANNEL",
    },
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    target: "elm",
  });

  expect(job_store.data.deploy.length).toBe(1);
  expect(JSON.stringify(job_store.data.deploy[0])).toBe(JSON.stringify({
    project_id: "PROJECT-ID",
    token: "TOKEN",
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
  }));
});

test("deploy unknown target", async () => {
  const {pipeline, job_store} = init_pipeline({
    job_tokens: {
      elm: {project_id: "PROJECT-ID", token: "TOKEN"},
    },
  });

  try {
    await pipeline.deploy({
      job_signature: {
        team: "TEAM",
        channel: "CHANNEL",
      },
      reply_to: {
        channel: "CHANNEL",
        timestamp: "TIMESTAMP",
      },
      target: "unknown",
    });

    throw "unknown token error not throwed";
  } catch (e) {
    expect(e).toBe("job token not found");
  }
});

test("deploy invalid project_id", async () => {
  const {pipeline, job_store} = init_pipeline({
    job_tokens: {
      elm: {project: "PROJECT-ID", token: "TOKEN"},
    },
  });

  try {
    await pipeline.deploy({
      job_signature: {
        team: "TEAM",
        channel: "CHANNEL",
      },
      reply_to: {
        channel: "CHANNEL",
        timestamp: "TIMESTAMP",
      },
      target: "elm",
    });

    throw "unknown token error not throwed";
  } catch (e) {
    expect(e).toBe("job token not found");
  }
});

test("deploy invalid token", async () => {
  const {pipeline, job_store} = init_pipeline({
    job_tokens: {
      elm: {project_id: "PROJECT-ID", trigger_token: "TOKEN"},
    },
  });

  try {
    await pipeline.deploy({
      job_signature: {
        team: "TEAM",
        channel: "CHANNEL",
      },
      reply_to: {
        channel: "CHANNEL",
        timestamp: "TIMESTAMP",
      },
      target: "elm",
    });

    throw "unknown token error not throwed";
  } catch (e) {
    expect(e).toBe("job token not found");
  }
});

const init_pipeline = ({job_tokens}) => {
  const job_store = job_store_factory.init({
    deploy_error: null,
  });

  const pipeline = pipeline_factory.init({
    secret_store: secret_store_factory.init({
      job_tokens,
    }),
    job_store,
  });

  return {
    pipeline,
    job_store,
  };
};
