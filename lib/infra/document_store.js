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
  let documentClient_data = null;
  const documentClient = () => {
    if (!documentClient_data) {
      documentClient_data = aws_dynamodb.documentClient();
    }
    return documentClient_data;
  };

  return {
    started_conversations: started_conversations(documentClient),
  };
};

/**
 * returns {
 *   put: async (struct) => put conversation id
 * }
 */
const started_conversations = (documentClient) => {
  const TableName = "started_conversations";

  /**
   * conversation/progress.signature()
   */
  const put = async ({session_id, progress_id}) => {
    const {team, conversation} = to_key(session_id);

    try {
      await documentClient().put({
        TableName,
        Item: {
          team,
          conversation,
          progress_id,
        },
        ConditionExpression: "attribute_not_exists(team) and attribute_not_exists(conversation)",
      });
    } catch(e) {
      console.error(e);
    }
  };

  /**
   * conversation/progress.signature()
   */
  const exists = async ({session_id, progress_id}) => {
    const item = await documentClient().get({
      TableName,
      Key: to_key(session_id),
      ConsistentRead: true,
      ProjectionExpression: "progress_id",
    });

    if (!item || !item.Item || item.Item.progress_id !== progress_id) {
      return false;
    }

    return true;
  };

  const to_key = ({team, channel, timestamp}) => {
    const conversation = [channel, timestamp].join(":");
    return {
      team,
      conversation,
    };
  };

  return {
    put,
    exists,
  };
};
