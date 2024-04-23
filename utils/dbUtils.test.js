const { MongoClient, ObjectId } = require("mongodb");
const {
  getGroup,
  getGroups,
  addUserToGroup,
  addGroupToUser,
  getUserGroups,
  getUserUnattendedGroups,
  getGroupUsers,
  isUserInGroup,
  removeUserFromGroup,
  removeGroupFromUser,
  addMessageToGroup,
  createGroupObject,
  emptyGroupsInterestAndRequirementsAmount,
  generateGroupName,
  getUser,
  updateUserInfo,
  isUsernameTaken,
  getUserEvents,
  getEvents,
  getGroupEvents,
  getGroupSuggestedEvents,
  addUserToEvent,
  addEventToUser,
  isUserInEvent,
  removeUserFromEvent,
  removeEventFromUser,
  isUserVotedToDelete,
  addSuggestedEventToGroup,
  setUserInterests,
} = require("./dbUtils");

//TODO: Tør ikke rode med deleteAllButOneEmptyGroup, repopulateGroups
//TODO: Generelt lidt rod med ObjectId. Nogle gange forventes der input der er objectId, andre gange strings. Ville nok være bedst hvis det altid var ObjectId
//TODO: Én fejl indtil videre. I addMessageToGroup, var year lig null, da den ikke gjorde brug af createdAt
//TODO: Mangler nok try catch i mange af funktionerne, f.eks. i tilfælde af at arrays er empty. F.eks. melder getGroupEvents fejl hvis arrayet er tomt

//Helper functions....
const testGroupId = new ObjectId("66256b923b56d9bc4924e93c"); //TODO Temp group object added to DB, MUST BE DELETED AFTER TEST
const testEventId = new ObjectId("662593ec3b56d9bc4924e952"); //TODO Temp event object added to DB, MUST BE DELETED AFTER TEST

async function addTestUser(db, testGroupId) {
  const result = await db.collection("users").insertOne({
    name: { firstName: "Test", lastName: "User" },
    password: "$2b$10$3WQXgvtZCu4StNhzF0PTMubYh4pgceAwnDOgNzBVeV2R/BnmIJOzG",
    bio: "Test Bio",
    birth: { day: "1", month: "1", year: "2002" },
    location: "Test Location",
    groupIds: [testGroupId],
    interests: ["Test Interest"],
    eventIds: [new ObjectId("662593ec3b56d9bc4924e952")],
    username: "TestUser",
    profileImageId: 1,
    gender: "Female",
  });
  return result.insertedId;
}

async function getAllGroupIds(db) {
  const groups = await db.collection("groups").find({}).toArray();
  return groups.map((group) => group._id);
}

//TODO Generel note: Jeg tror grunden til testene fejler nogle gange, er fordi connection sjældent lukkes ordentligt. Tag getGroups funktionen som eksempel...

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

  it("should return a group with the correct id", async () => {
    const group = await getGroup(testGroupId);

    expect(group).toBeDefined();
    expect(group._id).toEqual(testGroupId);
  });
});

//
///
////

describe("getGroups", () => {
  let db;
  let connection;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should return an array of groups", async () => {
    const ids = [
      new ObjectId("66228a36ebdee4f5e6c4804c"),
      new ObjectId("66228a36ebdee4f5e6c4804d"),
    ];
    const groups = await getGroups(ids);

    expect(Array.isArray(groups)).toBe(true);
    groups.forEach((group) => {
      expect(group).toHaveProperty("_id");
      expect(ids).toContainEqual(group._id);
      expect(group).toHaveProperty("groupName");
    });
  });
});

//
///
////

describe("addUserToGroup", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");

    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    // Remove the test user and user from group
    await db.collection("users").deleteOne({ _id: testUserId });
    await db
      .collection("groups")
      .updateOne({ _id: testGroupId }, { $pull: { userIds: testUserId } });
    await connection.close();
  });

  it("should add a user to a group", async () => {
    await addUserToGroup(testUserId, testGroupId);

    const group = await db.collection("groups").findOne({ _id: testGroupId });
    expect(group.userIds).toContainEqual(testUserId);
  });
});

//
///
////

describe("addGroupToUser", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");

    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    // Remove the test user
    await db.collection("users").deleteOne({ _id: testUserId });

    await connection.close();
  });

  it("should add a group to a user", async () => {
    await addGroupToUser(testGroupId, testUserId);

    const user = await db.collection("users").findOne({ _id: testUserId });
    expect(user.groupIds).toContainEqual(testGroupId);
  });
});

describe("getUserGroups", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");

    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    // Remove the test user
    await db.collection("users").deleteOne({ _id: testUserId });
    await connection.close();
  });

  it("should return the groups of a user", async () => {
    const groups = await getUserGroups(testUserId);

    expect(groups).toBeDefined();
    expect(groups).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: testGroupId })])
    );
  });
});

describe("getUserUnattendedGroups", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");

    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    // Remove the test user
    await db.collection("users").deleteOne({ _id: testUserId });
    await connection.close();
  });

  it("should return the groups that a user is not a part of", async () => {
    const groups = await getUserUnattendedGroups(testUserId);

    expect(groups).toBeDefined();
    expect(groups).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: testGroupId })])
    );
  });

  it("should return an empty array when the user is a part of all groups", async () => {
    const allGroupIds = await getAllGroupIds(db);
    await db
      .collection("users")
      .updateOne(
        { _id: testUserId },
        { $addToSet: { groupIds: { $each: allGroupIds } } }
      );

    const groups = await getUserUnattendedGroups(testUserId);

    expect(groups).toBeDefined();
    expect(groups).toEqual([]);
  });
});

describe("getGroupUsers", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
    await db
      .collection("groups")
      .updateOne({ _id: testGroupId }, { $push: { userIds: testUserId } });
  });

  afterAll(async () => {
    await db.collection("users").deleteOne({ _id: testUserId });
    await db
      .collection("groups")
      .updateOne({ _id: testGroupId }, { $pull: { userIds: testUserId } });
    await connection.close();
  });

  it("should return the users of a group", async () => {
    const users = await getGroupUsers(testGroupId);
    expect(users).toBeDefined();
    expect(users).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: testUserId })])
    ); //TODO: Ikke helt sikker på om det her er korrekt
  });
});

describe("isUserInGroup", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
    addUserToGroup(testUserId, testGroupId);
  });

  afterAll(async () => {
    await db
      .collection("groups")
      .updateOne({ _id: testGroupId }, { $pull: { userIds: testUserId } });
    await db.collection("users").deleteOne({ _id: testUserId });
    await connection.close();
  });

  it("should return true if the user is in the group", async () => {
    const isInGroup = await isUserInGroup(testUserId, testGroupId);
    expect(isInGroup).toBe(true);
  });

  it("should return false if the user is not in the group", async () => {
    await db
      .collection("groups")
      .updateOne({ _id: testGroupId }, { $pull: { userIds: testUserId } });
    const isInGroup = await isUserInGroup(testUserId, testGroupId);
    expect(isInGroup).toBe(false);
  });
});

describe("removeUserFromGroup", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    await db.collection("users").deleteOne({ _id: testUserId });
    await connection.close();
  });

  it("should remove the user from the group", async () => {
    await removeUserFromGroup(testUserId, testGroupId);
    const isInGroup = await isUserInGroup(testUserId, testGroupId);
    expect(isInGroup).toBe(false);
  });
});

describe("removeGroupFromUser", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
    addGroupToUser(testGroupId, testUserId);
  });

  afterAll(async () => {
    await db.collection("users").deleteOne({ _id: testUserId });
    await connection.close();
  });

  it("should remove the group from the user", async () => {
    await removeGroupFromUser(testGroupId, testUserId);
    const user = await db.collection("users").findOne({ _id: testUserId });
    expect(user.groupIds).not.toEqual(expect.arrayContaining([testGroupId]));
  });
});

describe("addMessageToGroup", () => {
  let db;
  let connection;
  let testUserId;
  let message;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
    message = {
      messageText: "Test message",
      authorName: "Test User",
      authorId: testUserId,
      createdAt: {
        year: 2024,
        month: 4,
        day: 15,
        hour: 14,
        minute: 36,
      },
      isCustom: true,
    };
  });

  afterAll(async () => {
    await db.collection("users").deleteOne({ _id: testUserId });
    await db
      .collection("groups")
      .updateOne(
        { _id: testGroupId },
        { $pull: { messages: { messageText: "Test message" } } }
      );
    await connection.close();
  });

  it("should add a message to the group", async () => {
    await addMessageToGroup(message, testGroupId);
    const group = await db.collection("groups").findOne({ _id: testGroupId });
    expect(group.messages).toEqual(expect.arrayContaining([message]));
  });
});

describe("createGroupObject", () => {
  //TODO: Ikke helt sikker på den her
});

describe("emptyGroupsInterestAndRequirementsAmount", () => {
  let db;
  let connection;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should empty the interest and requirements of all groups", async () => {
    let count = await emptyGroupsInterestAndRequirementsAmount("Football", {
      minAge: 18,
      maxAge: null,
      isMaleAllowed: true,
      isFemaleAllowed: true,
    });
    expect(count).toBeGreaterThan(0);
  });
});

describe("generateGroupName", () => {
  it("should generate a group name", () => {
    const groupName = generateGroupName();
    expect(groupName).toBeDefined();
    expect(typeof groupName).toBe("string");
  });
});

describe("getUser", () => {
  // This is the same as getLoggedInUser, apart from the token as paramater. However, if one works, the other works as well
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    await db.collection("users").deleteOne({ _id: testUserId });
    await connection.close();
  });

  it("should return the logged in user", async () => {
    const user = await getUser(testUserId);
    expect(user).toBeDefined();
    expect(user._id).toEqual(testUserId);
  });
});

describe("updateUserInfo", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    await db.collection("users").deleteOne({ _id: testUserId });
    await connection.close();
  });

  it("should update user info", async () => {
    const newInfo = {
      username: "NewUsername",
      age: "30",
      location: "New Location",
      firstName: "New",
      lastName: "Name",
      bio: "New Bio",
      gender: "New Gender",
    };
    await updateUserInfo(
      testUserId,
      newInfo.username,
      newInfo.age,
      newInfo.location,
      newInfo.firstName,
      newInfo.lastName,
      newInfo.bio,
      newInfo.gender,
      newInfo.password
    );
    const user = await db.collection("users").findOne({ _id: testUserId });
    expect(user.username).toEqual("NewUsername");
    expect(user.age).toEqual("30");
    expect(user.location).toEqual("New Location");
    expect(user.name.firstName).toEqual("New");
    expect(user.name.lastName).toEqual("Name");
    expect(user.bio).toEqual("New Bio");
    expect(user.gender).toEqual("New Gender");
  });
});

describe("isUsernameTaken", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    await db.collection("users").deleteOne({ _id: testUserId });
    await connection.close();
  });

  it("should return true if username is taken", async () => {
    const isTaken = await isUsernameTaken("TestUser");
    expect(isTaken).toBe(true);
  });

  it("should return false if username is not taken", async () => {
    const isTaken = await isUsernameTaken("Not Taken");
    expect(isTaken).toBe(false);
  });
});

describe("getUserEvents", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    await db.collection("users").deleteOne({ _id: testUserId });
    await connection.close();
  });

  it("should return the events of the user", async () => {
    const events = await getUserEvents(testUserId);
    expect(events).toBeDefined();
    expect(Array.isArray(events)).toBe(true);
  });
});

describe.only("getEvents", () => {
  let db;
  let connection;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should return all events", async () => {
    const events = await getEvents([new ObjectId("662593ec3b56d9bc4924e952")]);
    expect(events).toBeDefined();
    expect(Array.isArray(events)).toBe(true);
  });
});

describe("getGroupEvents", () => {
  let db;
  let connection;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should return the events of the group", async () => {
    const events = await getGroupEvents(testGroupId);
    expect(events).toBeDefined();
    expect(Array.isArray(events)).toBe(true);
  });
});

describe("getGroupSuggestedEvents", () => {
  let db;
  let connection;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should return the suggested events of the group", async () => {
    const events = await getGroupSuggestedEvents(testGroupId);
    expect(events).toBeDefined();
    expect(Array.isArray(events)).toBe(true);
  });
});

//Get event does not need to be tested, as this functionality has already been tested in getEvents

//TODO Det virker, hvis input kan være objectId, igen, hvorfor roder vi så meget rundt i om det skal være string eller objectID???
//+ Kan vi please blive enige om at starte med userID eller groupId eller EventId...
//Nogle gange er første parameter eventId, andre gange userid osv... Irriterende

describe("Event and User operations", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should add user to event", async () => {
    await addUserToEvent(testUserId, testEventId);
    const event = await db.collection("events").findOne({ _id: testEventId });
    expect(event.participantIds).toContainEqual(testUserId);
  });

  it("should add event to user", async () => {
    await addEventToUser(testEventId, testUserId);
    const user = await db.collection("users").findOne({ _id: testUserId });
    expect(user.eventIds).toContainEqual(testEventId);
  });

  it("should check if user is in event", async () => {
    const isInEvent = await isUserInEvent(testUserId, testEventId);
    expect(isInEvent).toBe(true);
  });

  it("should remove user from event", async () => {
    await removeUserFromEvent(testUserId, testEventId);
    const event = await db.collection("events").findOne({ _id: testEventId });
    expect(event.participantIds).not.toContainEqual(testUserId);
  });

  it("should remove event from user", async () => {
    await removeEventFromUser(testEventId, testUserId);
    const user = await db.collection("users").findOne({ _id: testUserId });
    expect(user.eventIds).not.toContainEqual(testEventId);
  });
});

describe("User and Group operations", () => {
  let db;
  let connection;
  let testUserId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DBURL);
    db = await connection.db("database");
    testUserId = await addTestUser(db, testGroupId);
  });

  afterAll(async () => {
    await db.collection("users").deleteOne({ _id: testUserId });
    await db
      .collection("groups")
      .updateOne({ _id: testGroupId }, { $pull: { suggestedEvents: [1] } });
    await connection.close();
  });

  it("should set user interests", async () => {
    const interests = ["American Football"];
    await setUserInterests(testUserId, interests);
    const user = await db.collection("users").findOne({ _id: testUserId });
    expect(user.interests).toEqual(interests);
  });
});
