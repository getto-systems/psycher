const document_store = require("../../lib/infra/document_store");

test("started_conversations.put", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: null,
    items: null,
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
    query: [],
  });
});

test("started_conversations.put error", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
    items: null,
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
    items: [{progress_id: "PROGRESS-ID"}],
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
    query: [
      {
        TableName: "started_conversations",
        KeyConditionExpression: "team = :team and conversation = :conversation",
        FilterExpression: "progress_id = :progress_id",
        ExpressionAttributeValues: {
          ":team": "TEAM",
          ":conversation": "CHANNEL:TIMESTAMP",
          ":progress_id": "PROGRESS-ID",
        },
        ProjectionExpression: "progress_id",
      },
    ],
  });
});

test("started_conversations.exists no items", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
    items: [],
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
    query: [
      {
        TableName: "started_conversations",
        KeyConditionExpression: "team = :team and conversation = :conversation",
        FilterExpression: "progress_id = :progress_id",
        ExpressionAttributeValues: {
          ":team": "TEAM",
          ":conversation": "CHANNEL:TIMESTAMP",
          ":progress_id": "PROGRESS-ID",
        },
        ProjectionExpression: "progress_id",
      },
    ],
  });
});

test("started_conversations.exists null items", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
    items: null,
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
    query: [
      {
        TableName: "started_conversations",
        KeyConditionExpression: "team = :team and conversation = :conversation",
        FilterExpression: "progress_id = :progress_id",
        ExpressionAttributeValues: {
          ":team": "TEAM",
          ":conversation": "CHANNEL:TIMESTAMP",
          ":progress_id": "PROGRESS-ID",
        },
        ProjectionExpression: "progress_id",
      },
    ],
  });
});

test("documentClient call only once", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
    items: null,
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

const init_aws_dynamodb = ({put_error, items}) => {
  let data = {
    documentClient: 0,
    put: [],
    query: [],
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

      query: async (struct) => {
        data.query.push(struct);
        return {
          Items: items
        };
      },
    };
  };

  return {
    documentClient,
    data,
  };
};
