const document_store = require("../../lib/infra/uuid_store");

test("generate_uuid", async () => {
  const {store} = init_uuid_store({
    uuid: "UUID",
  });

  const result = await store.generate_uuid();

  expect(result).toEqual("UUID");
});

const init_uuid_store = (struct) => {
  const uuid = init_uuid(struct);

  const store = document_store.init({
    uuid,
  });

  return {
    store,
  };
};

const init_uuid = ({uuid}) => {
  return () => uuid;
};
