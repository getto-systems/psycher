const document_store = require("../../lib/infra/document_store");

test("started_conversations.put", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: null,
    item: {Item: {}},
  });

  await store.started_conversations.put({
    session_id: {
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    progress_id: "PROGRESS-ID",
  });

  expect(aws_dynamodb.data).toEqual({
    documentClient: 1,
    put: [
      {
        TableName: "started_conversations",
        Item: {
          team: "TEAM",
          conversation: "CHANNEL:TIMESTAMP",
          progress_id: "PROGRESS-ID",
        },
        ConditionExpression: "attribute_not_exists(team) and attribute_not_exists(conversation)",
      },
    ],
    get: [],
  });
});

test("started_conversations.put error", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
    item: {Item: {}},
  });

  await store.started_conversations.put({
    session_id: {
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    progress_id: "PROGRESS-ID",
  });
});

test("started_conversations.exists", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: null,
    item: {Item: {progress_id: "PROGRESS-ID"}},
  });

  const result = await store.started_conversations.exists({
    session_id: {
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    progress_id: "PROGRESS-ID",
  });

  expect(result).toBe(true);

  expect(aws_dynamodb.data).toEqual({
    documentClient: 1,
    put: [],
    get: [
      {
        TableName: "started_conversations",
        Key: {
          team: "TEAM",
          conversation: "CHANNEL:TIMESTAMP",
        },
        ConsistentRead: true,
        ProjectionExpression: "progress_id",
      },
    ],
  });
});

test("started_conversations.exists different progress_id", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
    item: {Item: {progress_id: "DIFFERENT-PROGRESS-ID"}},
  });

  const result = await store.started_conversations.exists({
    session_id: {
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    progress_id: "PROGRESS-ID",
  });

  expect(result).toBe(false);

  expect(aws_dynamodb.data).toEqual({
    documentClient: 1,
    put: [],
    get: [
      {
        TableName: "started_conversations",
        Key: {
          team: "TEAM",
          conversation: "CHANNEL:TIMESTAMP",
        },
        ConsistentRead: true,
        ProjectionExpression: "progress_id",
      },
    ],
  });
});

test("started_conversations.exists no progress_id", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
    item: {Item: {}},
  });

  const result = await store.started_conversations.exists({
    session_id: {
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    progress_id: "PROGRESS-ID",
  });

  expect(result).toBe(false);

  expect(aws_dynamodb.data).toEqual({
    documentClient: 1,
    put: [],
    get: [
      {
        TableName: "started_conversations",
        Key: {
          team: "TEAM",
          conversation: "CHANNEL:TIMESTAMP",
        },
        ConsistentRead: true,
        ProjectionExpression: "progress_id",
      },
    ],
  });
});

test("started_conversations.exists no item", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
    item: {},
  });

  const result = await store.started_conversations.exists({
    session_id: {
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    progress_id: "PROGRESS-ID",
  });

  expect(result).toBe(false);

  expect(aws_dynamodb.data).toEqual({
    documentClient: 1,
    put: [],
    get: [
      {
        TableName: "started_conversations",
        Key: {
          team: "TEAM",
          conversation: "CHANNEL:TIMESTAMP",
        },
        ConsistentRead: true,
        ProjectionExpression: "progress_id",
      },
    ],
  });
});

test("started_conversations.exists null item", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
    item: null,
  });

  const result = await store.started_conversations.exists({
    session_id: {
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    progress_id: "PROGRESS-ID",
  });

  expect(result).toBe(false);

  expect(aws_dynamodb.data).toEqual({
    documentClient: 1,
    put: [],
    get: [
      {
        TableName: "started_conversations",
        Key: {
          team: "TEAM",
          conversation: "CHANNEL:TIMESTAMP",
        },
        ConsistentRead: true,
        ProjectionExpression: "progress_id",
      },
    ],
  });
});

test("documentClient call only once", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
    item: null,
  });

  await store.started_conversations.put({
    session_id: {
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    progress_id: "PROGRESS-ID",
  });
  await store.started_conversations.exists({
    session_id: {
      team: "TEAM",
      channel: "CHANNEL",
      timestamp: "TIMESTAMP",
    },
    progress_id: "PROGRESS-ID",
  });

  expect(aws_dynamodb.data.documentClient).toBe(1);
});

const init_document_store = (struct) => {
  const aws_dynamodb = init_aws_dynamodb(struct);

  const store = document_store.init({
    aws_dynamodb,
  });

  return {
    store,
    aws_dynamodb,
  };
};

const init_aws_dynamodb = ({put_error, item}) => {
  let data = {
    documentClient: 0,
    put: [],
    get: [],
  };

  const documentClient = () => {
    data.documentClient ++;

    return {
      put: async (struct) => {
        data.put.push(struct);
        if (put_error) {
          throw put_error;
        }
      },

      get: async (struct) => {
        data.get.push(struct);
        return item;
      },
    };
  };

  return {
    documentClient,
    data,
  };
};
