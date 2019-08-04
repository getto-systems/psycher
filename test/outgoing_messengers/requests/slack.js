exports.init = () => init();

const init = () => {
  let data = {
    reply: [],
    reaction: [],
  };

  const reply = async (info, secret, text) => {
    data.reply.push(info);
    return null;
  };

  const reaction = async (info, secret, name) => {
    data.reaction.push(info);
    return null;
  };

  return {
    reply,
    reaction,
    data,
  };
};
