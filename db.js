const { MongoClient } = require("mongodb");

let dbConnection;
const dbName = "database";
let uri = `mongodb+srv://lasse301003:LWpUdRZ1vcmOfLUx@cluster0.umqdk3l.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
