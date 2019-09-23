const deployment_factory = require("../../../lib/conversation/job/deployment");

const secret_store_factory = require("../../infra/secret_store");

test("select target from only one target", async () => {
  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_targets: ["elm"],
    }),
  });

  const targets = await deployment.targets({
    job_signature: {
      team: "TEAM",
      channel: "CHANNEL",
    },
  });

  expect(targets).toEqual(["elm"]);
});
