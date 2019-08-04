const gitlab_secret = require("../../lib/secrets/gitlab");

test("find token", () => {
  const raw_secret = {
    trigger_tokens: {
      "TEAM": {
        "CHANNEL": {
          "elm": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" },
          "rails": { project_id: "RAILS_PROJECT_ID", token: "RAILS_TOKEN" },
        }
      },
    },
  };
  const secret = gitlab_secret.prepare(raw_secret).init({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "elm",
  });

  expect(secret.channel).toBe("CHANNEL");
  expect(secret.timestamp).toBe("TIMESTAMP");
  expect(secret.project_id).toBe("ELM_PROJECT_ID");
  expect(secret.trigger_token).toBe("ELM_TOKEN");
});

test("one target token", () => {
  const raw_secret = {
    trigger_tokens: {
      "TEAM": {
        "CHANNEL": { "elm": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" } }
      },
    },
  };
  const secret = gitlab_secret.prepare(raw_secret).init({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "unknown",
  });

  expect(secret.channel).toBe("CHANNEL");
  expect(secret.timestamp).toBe("TIMESTAMP");
  expect(secret.project_id).toBe("ELM_PROJECT_ID");
  expect(secret.trigger_token).toBe("ELM_TOKEN");
});

test("no token", () => {
  const raw_secret = {
    trigger_tokens: {
      "TEAM": {
        "CHANNEL": {
          "elm": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" },
          "rails": { project_id: "RAILS_PROJECT_ID", token: "RAILS_TOKEN" },
        },
      },
    },
  };
  const secret = gitlab_secret.prepare(raw_secret).init({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "unknown",
  });

  expect(secret).toBe(null);
});
