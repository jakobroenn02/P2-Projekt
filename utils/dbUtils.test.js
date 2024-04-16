const { MongoClient, ObjectId } = require("mongodb");
const { getGroup } = require("./dbUtils");

describe("getGroup", () => {
    let db;
    let connection;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
      db = await connection.db("database");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should return group object", async () => {
    const testGroupId = '6617d5100eb926d23a0dbbf9';

    const foundGroup = await getGroup(testGroupId);

    expect(foundGroup._id).toStrictEqual(new ObjectId(testGroupId));
  });
});
