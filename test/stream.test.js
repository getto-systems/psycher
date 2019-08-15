const stream_factory = require("../lib/stream");

const secret_store_factory = require("./infra/secret_store");
const message_store_factory = require("./infra/message_store");

test("post", async () => {
  const {stream, message_store} = init_stream();

  await stream.post({
    reply_to: {
      channel: "CHANNEL",
    },
    text: "TEXT",
  });

  expect(message_store.data).toEqual({
    post: [
      {
        token: "MESSAGE-TOKEN",
        reply_to: {
          channel: "CHANNEL",
        },
        text: "TEXT",
      },
    ],
    add: [],
  });
});

test("add", async () => {
  const {stream, message_store} = init_stream();

  await stream.add({
    reply_to: {
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    name: "NAME",
  });

  expect(message_store.data).toEqual({
    post: [],
    add: [
      {
        token: "MESSAGE-TOKEN",
        reply_to: {
          channel: "CHANNEL",
          timestamp: "TIMESTAMP",
        },
        name: "NAME",
      },
    ],
  });
});

const init_stream = () => {
  const message_store = message_store_factory.init();

  const stream = stream_factory.init({
    secret_store: secret_store_factory.init({
      message_token: "MESSAGE-TOKEN",
    }),
    message_store,
  });

  return {
    stream,
    message_store,
  };
};
