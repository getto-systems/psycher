const slack_bot_event = require("../lib/slack_bot_event");

test("init event_info", async () => {
  const event_info = slack_bot_event.parse({
    event: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "deploy elm",
    },
  });

  expect(JSON.stringify(event_info)).toBe(JSON.stringify({
    type: "app_mention",
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
    text: "deploy elm",
  }));
});

test("empty type", async () => {
  const event_info = slack_bot_event.parse({
    event: {
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "deploy elm",
    },
  });

  expect(event_info).toBe(null);
});

test("empty team", async () => {
  const event_info = slack_bot_event.parse({
    event: {
      type: "app_mention",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
      text: "deploy elm",
    },
  });

  expect(event_info).toBe(null);
});

test("empty channel", async () => {
  const event_info = slack_bot_event.parse({
    event: {
      type: "app_mention",
      team: "TEAM",
      ts: "TIMESTAMP",
      text: "deploy elm",
    },
  });

  expect(event_info).toBe(null);
});

test("empty ts", async () => {
  const event_info = slack_bot_event.parse({
    event: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      text: "deploy elm",
    },
  });

  expect(event_info).toBe(null);
});

test("empty text", async () => {
  const event_info = slack_bot_event.parse({
    event: {
      type: "app_mention",
      team: "TEAM",
      channel: "CHANNEL",
      ts: "TIMESTAMP",
    },
  });

  expect(event_info).toBe(null);
});

test("empty event", async () => {
  const event_info = slack_bot_event.parse({
  });

  expect(event_info).toBe(null);
});
