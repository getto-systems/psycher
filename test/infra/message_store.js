exports.init = (data) => init(data);

/**
 * returns infra/message_store + data
 */
const init = () => {
  let data = {
    post: [],
    add: [],
  };

  const post = async (struct) => {
    data.post.push(struct);
  };

  const add = async (struct) => {
    data.add.push(struct);
  };

  return {
    post,
    add,
    data,
  };
};
