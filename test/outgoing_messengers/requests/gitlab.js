exports.init = () => init();

const init = () => {
  let data = {
    trigger: [],
  };

  const trigger = async (info, secret) => {
    data.trigger.push(info);
    return null;
  };

  return {
    trigger,
    data,
  };
};
