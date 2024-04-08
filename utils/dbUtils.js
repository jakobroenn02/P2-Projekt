const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");

let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

// Common usecases of db interaction made easier.

//
//
//
//
//
//
//
//
//
//
//Group functionality
async function getGroup(groupId) {
  return await db.collection("groups").findOne({ _id: new ObjectId(groupId) });
}
async function addUserToGroup(userId, groupId) {
  await db.collection("groups").updateOne(
    { _id: new ObjectId(groupId) },
    {
      $push: {
        userIds: new ObjectId(userId),
      },
    }
  );
}
async function addGroupToUser(groupId, userId) {
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $push: {
        groupIds: new ObjectId(groupId),
      },
    }
  );
}
async function getUserGroups(userId) {
  const user = await getUser(userId);

  return await db
    .collection("groups")
    .find({
      _id: {
        $in: user.groupIds,
      },
    })
    .toArray();
}
async function getUserUnattendedGroups(userId) {
  const user = await getUser(userId);
  return await db
    .collection("groups")
    .find({
      _id: {
        $nin: user.groupIds,
      },
    })
    .toArray();
}
function getCommonGroups() {
  console.log("hey");
}
async function getGroupUsers(groupId) {
  const group = await getGroup(groupId);

  return await db
    .collection("users")
    .find({ _id: { $in: group.userIds } })
    .toArray();
}
async function isUserInGroup(userId, groupId) {
  //TODO doesnt work
  const group = await getGroup(groupId);
  for (let i = 0; i < group.userIds.length; i++) {
    if (group.userIds[i].toString() == userId) {
      return true;
    }
  }
  return false;
}
async function removeUserFromGroup(userId, groupId) {}
async function removeGroupFromUser(groupId, userId) {}
async function getDiscoverGroups() {}
function sortUserGroupsBasedOnInterests(user) {}
async function userJoinGroup(userId, groupId) {}
async function userLeaveGroup(userId, groupId) {}
async function addMessageToGroup(message, groupId) {
  await db.collection("groups").updateOne(
    { _id: new ObjectId(groupId) },
    {
      $push: {
        messages: {
          messageText: message.messageText,
          authorName: message.authorName,
          authorId: message.authorId,
          createdAt: {
            year: message.year,
            month: message.createdAt.month,
            day: message.createdAt.day,
            hour: message.createdAt.hour,
            minute: message.createdAt.minute,
          },
          isCustom: message.isCustom,
        },
      },
    }
  );
}

//
//
//
//
//
//
//
//
//
//
//User functionality
async function getLoggedInUser(token) {
  return await db.collection("users").findOne({ _id: new ObjectId(token._id) });
}
async function getUser(userId) {
  return await db.collection("users").findOne({ _id: new ObjectId(userId) });
}
async function updateUserInfo(
  userId,
  username,
  age,
  location,
  firstName,
  lastName,
  bio,
  gender
) {
  // if parameter is null, it wont change it
  const user = await getUser(userId);

  await db.collection("users").updateMany(
    { _id: new ObjectId(req.body.userId) },
    {
      $set: {
        username: username == null ? user.username : username,
        age: age == null ? user.age : age,
        location: location == null ? user.location : location,
        gender: gender == null ? user.gender : gender,
        "name.firstName": firstName == null ? user.name.firstName : firstName,
        "name.lastName": lastName == null ? user.name.lastName : lastName,
        bio: bio == null ? user.bio : bio,
      },
    }
  );
}
function createUser() {}
async function isUsernameTaken(username) {
  return (await db.collection("users").findOne({ username: username }))
    ? true
    : false;
}

//
//
//
//
//
//
//
//
//
//
//Event functionality
async function getUserEvents(userId) {
  const user = await getUser(userId);

  return await db
    .collection("events")
    .find({
      _id: {
        $in: user.eventIds,
      },
    })
    .toArray();
}
async function getGroupEvents(groupId) {
  const group = await getGroup(groupId);

  await db
    .collection("events")
    .find({ _id: { $in: group.eventIds } })
    .toArray();
}
function getCommonEvents() {}
async function insertEvent(event) {}
async function addEventToGroup(eventId, groupId) {}
async function getEvent(eventId) {}
async function getEventParticipants(eventId) {}
async function userLeaveEvent(userId, eventId) {}
async function removeUserFromEvent(userId, eventId) {}
async function removeEventFromUser(eventId, userId) {}
function createEvent(
  eventName,
  date,
  description,
  location,
  groupId,
  participantIds
) {}

//
//
//
//
//
//
//
//
//
//
//Location functionality
async function getLocations() {
  return await db.collection("locations").find().toArray();
}

//
//
//
//
//
//
//
//
//
//
//Interest functionality
async function setUserInterests(userId, interests) {}

async function getInterests() {}

module.exports = {
  getUserEvents,
  getLoggedInUser,
  getUserGroups,
  getUserUnattendedGroups,
  getGroup,
  isUserInGroup,
  getGroupUsers,
  getGroupEvents,
  addGroupToUser,
  addUserToGroup,
  getLocations,
  isUsernameTaken,
  updateUserInfo,
  addMessageToGroup,
};
