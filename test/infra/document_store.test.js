const document_store = require("../../lib/infra/document_store");

test("started_conversations.put", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: null,
  });

  const result = await store.started_conversations.put({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  });

  expect(result).toBe(true);
  expect(aws_dynamodb.data.put.length).toBe(1);
  expect(JSON.stringify(aws_dynamodb.data.put[0])).toBe(JSON.stringify({
    TableName: "started_conversations",
    Item: {
      team: "TEAM",
      conversation: "CHANNEL:TIMESTAMP",
    },
    ConditionExpression: "attribute_not_exists(team) and attribute_not_exists(conversation)",
  }));
});

test("started_conversations.put error", async () => {
  const {store, aws_dynamodb} = init_document_store({
    put_error: "already put",
  });

  const result = await store.started_conversations.put({
    team: "TEAM",
    channel: "CHANNEL",
    timestamp: "TIMESTAMP",
  });

  expect(result).toBe(false);
});

const init_document_store = ({put_error}) => {
  const aws_dynamodb = init_aws_dynamodb({
    put_error,
  });

  const store = document_store.init({
    aws_dynamodb,
  });

  return {
    store,
    aws_dynamodb,
  };
};

const init_aws_dynamodb = ({put_error}) => {
  let data = {
    put: [],
  };

  const documentClient = () => {
    return {
      put: async (struct) => {
        data.put.push(struct);
        if (put_error) {
          throw put_error;
        }
      },
    };
  };

  return {
    documentClient,
    data,
  };
};
