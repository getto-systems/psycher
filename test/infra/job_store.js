exports.init = (data) => init(data);

/**
 * returns infra/job_store + data
 */
const init = ({deploy_error}) => {
  let data = {
    deploy: [],
  };

  const deploy = async (struct) => {
    if (deploy_error) {
      throw deploy_error;
    }
    data.deploy.push(struct);
  };

  return {
    deploy,
    data,
  };
};
