const gitlab = require("../lib/outgoing_messengers/requests/gitlab");

const secret = {
  channel: "CHANNEL",
  timestamp: "TIMESTAMP",
  project_id: process.env.GITLAB_PROJECT_ID,
  trigger_token: process.env.GITLAB_TRIGGER_TOKEN,
};

gitlab.trigger("release", secret).trigger();
