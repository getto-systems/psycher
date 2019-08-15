const pipeline_factory = require("../lib/pipeline");

const secret_store_factory = require("./infra/secret_store");
const job_store_factory = require("./infra/job_store");

test("deploy", async () => {
  const {pipeline, job_store} = init_pipeline({
    job_token: {project_id: "PROJECT-ID", token: "TOKEN"},
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

  expect(job_store.data).toEqual({
    deploy: [
      {
        job_token: {
          project_id: "PROJECT-ID",
          token: "TOKEN",
        },
        reply_to: {
          channel: "CHANNEL",
          timestamp: "TIMESTAMP",
        },
      },
    ],
  });
});

test("deploy unknown target", async () => {
  const {pipeline, job_store} = init_pipeline({
    job_token: null,
  });

  await expect(pipeline.deploy({
    deployment_signature: {
      job_signature: {
        team: "TEAM",
        channel: "CHANNEL",
      },
      target: "unknown",
    },
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
  })).rejects.toBe("job token not found");
});

const init_pipeline = ({job_token}) => {
  const job_store = job_store_factory.init({
    deploy_error: null,
  });

  const pipeline = pipeline_factory.init({
    secret_store: secret_store_factory.init({
      job_token,
    }),
    job_store,
  });

  return {
    pipeline,
    job_store,
  };
};
