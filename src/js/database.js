const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://lasse301003:LWpUdRZ1vcmOfLUx@cluster0.umqdk3l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function addEvent(eventName, interests, location) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Lokating events collection
    const db = client.db("database");
    const eventCollection = db.collection("events");

    //Create event object.
    const event = {
      eventName: eventName,
      interests: interests,
      location: location,
    };

    //insert event
    eventCollection.insertOne(event);

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function createUser(userName, password, bio, age, location) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Lokating events collection
    const db = client.db("database");
    const users = db.collection("users");

    //Create event object.
    const user = {
      userName: userName,
      password: password,
      bio: bio,
      age: age,
      location: location,
    };

    //insert event
    users.insertOne(user);

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function addGroupToUser(groupId, userId) {
  try {
    await client.connect();

    const db = client.db("database");
    const usersDB = db.collection("users");

    usersDB.updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: {
          groupIds: new ObjectId(groupId),
        },
      }
    );

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function findUser(id) {
  try {
    await client.connect();

    const db = client.db("database");
    const usersDB = db.collection("users");

    const user = await usersDB.findOne({ _id: new ObjectId(id) });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function addGroup(groupName) {
  try {
    await client.connect();

    const db = client.db("database");
    const groupsDB = db.collection("groups");

    const group = {
      groupName: groupName,
    };

    groupsDB.insertOne(group);

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function removeGroupFromUser(groupId, userId) {
  try {
    await client.connect();

    const db = client.db("database");
    const usersDB = db.collection("users");

    usersDB.updateOne(
      { _id: new ObjectId(userId) },
      {
        $pull: {
          groupIds: {
            $in: [new ObjectId(groupId)],
          },
        },
      }
    );

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function addInterestsToUser(userId, interests) {
  try {
    await client.connect();

    const db = client.db("database");
    const usersDB = db.collection("users");
    interests.forEach((interest) => {
      usersDB.updateOne(
        { _id: new ObjectId(userId) },
        {
          $push: {
            interests: interest,
          },
        }
      );
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


