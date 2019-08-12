const job_store = require("../../lib/infra/job_store");

test("trigger", async () => {
  const gitlab_api = init_gitlab_api();

  const store = job_store.init({
    gitlab_api,
  });

  await store.deploy({
    project_id: "PROJECT-ID",
    token: "TOKEN",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  });

  expect(gitlab_api.data.trigger.length).toBe(1);
  expect(JSON.stringify(gitlab_api.data.trigger[0])).toBe(JSON.stringify({
    project_id: "PROJECT-ID",
    token: "TOKEN",
    ref: "master",
    variables: {
      RELEASE: "true",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
  }));
});

const init_gitlab_api = () => {
  let data = {
    trigger: [],
  };

  const trigger = async (struct) => {
    data.trigger.push(struct);
    return {
      status: 200,
    };
  };

  return {
    trigger,
    data,
  };
};
