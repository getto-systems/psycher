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
  const generate_uuid = () => uuid.generate();

  return {
    generate_uuid,
  };
};
