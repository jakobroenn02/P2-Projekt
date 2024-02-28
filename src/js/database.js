const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://lasse301003:LWpUdRZ1vcmOfLUx@cluster0.umqdk3l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("database");
    const groups = db.collection("groups");

    const group = {
        peopleIds: [1,2,3],
        eventIds: [2,3,9],
        groupName: "Bedste gruppe der findes"
    }

    const p = await groups.insertOne(group);

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);