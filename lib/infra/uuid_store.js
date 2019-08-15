exports.init = (struct) => init(struct);

/**
 * struct : {
 *   uuid: vendor/uuid
 * }
 *
 * returns {
 *   generate_uuid : () => generate uuid
 * }
 */
const init = ({uuid}) => {
  const generate_uuid = () => uuid();

  return {
    generate_uuid,
  };
};
