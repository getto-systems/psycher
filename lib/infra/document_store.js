exports.init = (struct) => init(struct);

/**
 * struct : {
 *   aws_dynamodb: vendor/aws_dynamodb
 * }
 *
 * returns {
 *   started_conversations : handling started_conversations
 * }
 */
const init = ({aws_dynamodb}) => {
  return {
    started_conversations: started_conversations(aws_dynamodb),
  };
};

/**
 * returns {
 *   put: async (struct) => put conversation id
 * }
 */
const started_conversations = (aws_dynamodb) => {
  const TableName = "started_conversations";

  /**
   * struct : {
   *   team: slack team
   *   channel: slack channel
   *   timestamp: event timestamp
   * }
   */
  const put = async ({team, channel, timestamp}) => {
    const conversation = [channel, timestamp].join(":");

    try {
      const documentClient = aws_dynamodb.documentClient();
      await documentClient.put({
        TableName,
        Item: {
          team,
          conversation,
        },
        ConditionExpression: "attribute_not_exists(team) and attribute_not_exists(conversation)",
      });

      return true;
    } catch(e) {
      console.error(e);
      return false;
    }
  };

  return {
    put,
  };
};
