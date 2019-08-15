exports.init = (data) => init(data);

/**
 * returns infra/uuid_store
 */
const init = ({uuid}) => {
  return {
    generate_uuid: () => uuid,
  };
};
