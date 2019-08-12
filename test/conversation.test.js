const slack_bot_event = require("../lib/slack_bot_event");

test("init conversation", async () => {
  const conversation = slack_bot_event.parse({
    event: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "deploy elm",
    },
  });

  expect(conversation.is_mention()).toBe(true);
  expect(conversation.includes("deploy")).toBe(true);

  expect(JSON.stringify(conversation.session_id())).toBe(JSON.stringify({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  }));
  expect(JSON.stringify(conversation.reply_to())).toBe(JSON.stringify({
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  }));
  expect(JSON.stringify(conversation.job_signature())).toBe(JSON.stringify({
    team: "TEAM",
    channel: "CHANNEL",
  }));
});

test("unknown event type", async () => {
  const conversation = slack_bot_event.parse({
    event: {
      type: "unknown",
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "deploy elm",
    },
  });

  expect(conversation.is_mention()).toBe(false);
});

test("empty type", async () => {
  const conversation = slack_bot_event.parse({
    event: {
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "deploy elm",
    },
  });

  expect(conversation).toBe(null);
});

test("empty team", async () => {
  const conversation = slack_bot_event.parse({
    event: {
      type: "app_mention",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "deploy elm",
    },
  });

  expect(conversation).toBe(null);
});

test("empty channel", async () => {
  const conversation = slack_bot_event.parse({
    event: {
      type: "app_mention",
      team: "TEAM",
      ts: "TIMESTAMP",
      text: "deploy elm",
    },
  });

  expect(conversation).toBe(null);
});

test("empty ts", async () => {
  const conversation = slack_bot_event.parse({
    event: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      text: "deploy elm",
    },
  });

  expect(conversation).toBe(null);
});

test("empty text", async () => {
  const conversation = slack_bot_event.parse({
    event: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
    },
  });

  expect(conversation).toBe(null);
});

test("empty event", async () => {
  const conversation = slack_bot_event.parse({
  });

  expect(conversation).toBe(null);
});
