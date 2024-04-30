const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const { MAX_MEMBERS, INTEREST_DESCRIPTIONS } = require("./constUtils");
const { getRandomElement, getAgeFromBirthDate } = require("./generalUtil");

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
  //Returns a group from id
  return await db.collection("groups").findOne({ _id: new ObjectId(groupId) });
}

async function getGroups(groupIds) {
  //Returns a group from id
  return await db
    .collection("groups")
    .find({ _id: { $in: groupIds } })
    .toArray();
}

async function addUserToGroup(userId, groupId) {
  //Takes user and group, and adds the user to groupIds
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
  //Takes group and user, and ands group to user
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
  //Takes a user, and return a list of all the groups he is member of
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
  //Takes a user, and returns a list of all the groups the user is not a member of.
  const user = await getUser(userId);

  let groups = await db
    .collection("groups")
    .find({
      _id: {
        $nin: user.groupIds,
      },
    })
    .toArray();

  // Filter away full groups, and groups that user can't join, because user doesn't live up to the requirements.
  groups = groups.filter((group) => {
    if (group.userIds.length >= group.maxMembers) {
      return false;
    }

    if (
      group.requirements.maxAge == undefined &&
      group.requirements.minAge <= getAgeFromBirthDate(user.birth) &&
      ((user.gender == "Male" && group.requirements.isMaleAllowed) ||
        (user.gender == "Female" && group.requirements.isFemaleAllowed))
    ) {
      return true;
    } else if (
      group.requirements.minAge <= getAgeFromBirthDate(user.birth) &&
      group.requirements.maxAge >= getAgeFromBirthDate(user.birth) &&
      ((user.gender == "Male" && group.requirements.isMaleAllowed) ||
        (user.gender == "Female" && group.requirements.isFemaleAllowed))
    ) {
      return true;
    }
  });

  return groups;
}
function getCommonGroups() {
  //Should take user1 and user2, and return their common groups
}

async function getGroupUsers(groupId) {
  // returns the list of users from a group
  const group = await getGroup(groupId);

  return await db
    .collection("users")
    .find({ _id: { $in: group.userIds } })
    .toArray();
}
async function isUserInGroup(userId, groupId) {
  //Takes a user and a group, and return true or false wether user is in group or not
  const group = await getGroup(groupId);
  for (let i = 0; i < group.userIds.length; i++) {
    if (group.userIds[i].toString() == userId) {
      return true;
    }
  }
  return false;
}
async function removeUserFromGroup(userId, groupId) {
  //Takes user and group, and removes user from userIDs in group
  await db.collection("groups").updateOne(
    { _id: new ObjectId(groupId) },
    {
      $pull: {
        userIds: {
          $in: [new ObjectId(userId)],
        },
      },
    }
  );
}
async function removeGroupFromUser(groupId, userId) {
  // Takes group and user, and removes group from groupIds in user
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $pull: {
        groupIds: {
          $in: [new ObjectId(groupId)],
        },
      },
    }
  );
}
async function addMessageToGroup(message, groupId) {
  //Takes a message, and a group, and add the message to the group in the database.
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

function createGroupObject(interest, location, requirements) {
  return {
    groupName: generateGroupName(interest),
    description: getGroupDescription(interest),
    interest: interest,
    maxMembers: MAX_MEMBERS,
    location: location,
    requirements: requirements,
    suggestedEventIds: [],
    eventIds: [],
    userIds: [],
    messages: [],
  };
}

async function addGroup(group) {
  const insertRes = await db.collection("groups").insertOne(group);
  addSuggestedEventToGroup(insertRes.insertedId);
}

//Returns the amount of groups that are empty, has a specific interest and requirements.
async function emptyGroupsInterestAndRequirementsAmount(
  interest,
  requirements
) {
  const groups = await db
    .collection("groups")
    .find({
      interest: interest,
      requirements: requirements,
    })
    .toArray();

  return groups.filter((group) => group.userIds.length == 0).length;
}

//Deletes all groups of a specific interest and requirement, and creates a new empty one.
async function deleteAllButOneEmptyGroup(interest, requirements, location) {
  const groupsToDelete = await db
    .collection("groups")
    .find({
      interest: interest,
      requirements: requirements,
      userIds: {
        $size: 0,
      },
    })
    .toArray();

  const groupsToDeleteIds = groupsToDelete.map((group) => {
    return group._id;
  });

  //delete all the events related to group:
  const res = await db.collection("events").deleteMany({
    groupId: { $in: groupsToDeleteIds },
  });

  console.log(res);

  await db.collection("groups").deleteMany({
    interest: interest,
    requirements: requirements,
    userIds: {
      $size: 0,
    },
  });

  await addGroup(createGroupObject(interest, location, requirements));
}

//Function that makes a group of each combination of interests and requirements.
async function repopulateGroups(interests, requirements, location) {
  interests.forEach(async (interest) => {
    requirements.forEach(async (requirement) => {
      const emptyGroups = await db
        .collection("groups")
        .find({
          interest: interest,
          requirements: requirement,
          userIds: {
            $size: 0,
          },
        })
        .toArray();

      if (emptyGroups.length == 0) {
        addGroup(createGroupObject(interest, location, requirement));
      }
    });
  });
}

//Generates a random groupname based on interest with suffix and prefix ex: "The Football Crew"
function generateGroupName(interest) {
  // Prefixes and suffixes to make the group name unique
  const prefixes = [
    "The",
    "Team",
    "Alliance",
    "Squad",
    "Club",
    "Guild",
    "Fellowship",
    "Association",
    "League",
  ];
  const suffixes = [
    "Group",
    "Crew",
    "Society",
    "Bunch",
    "Gang",
    "Circle",
    "Band",
    "Collective",
    "Ensemble",
  ];

  // Function to generate a random element from an array

  // Generating a unique group name
  const prefix = getRandomElement(prefixes);
  const suffix = getRandomElement(suffixes);

  return `${prefix} ${interest} ${suffix}`;
}

// Gets the description of a specific interest. The descriptions are hardcoded in generalutils.js
function getGroupDescription(interest) {
  return INTEREST_DESCRIPTIONS[interest];
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
  //Takes a token, and returns the user of which the id in the token is related to.
  return await db.collection("users").findOne({ _id: new ObjectId(token._id) });
}
async function getUser(userId) {
  //takes id, and return the user related to the id.
  return await db.collection("users").findOne({ _id: new ObjectId(userId) });
}
async function updateUserInfo(
  userId,
  username,
  birth,
  location,
  firstName,
  lastName,
  bio,
  gender,
  password
) {
  // if parameter value is null, it wont change it
  const user = await getUser(userId);

  await db.collection("users").updateMany(
    { _id: new ObjectId(userId) },
    {
      $set: {
        username: username == null ? user.username : username,
        birth: birth == null ? user.birth : birth,
        location: location == null ? user.location : location,
        gender: gender == null ? user.gender : gender,
        "name.firstName": firstName == null ? user.name.firstName : firstName,
        "name.lastName": lastName == null ? user.name.lastName : lastName,
        bio: bio == null ? user.bio : bio,
        password: password == null ? user.password : password,
      },
    });
}
async function isUsernameTaken(username) {
  //return true if username is taken, else false.
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
  //Takes a user, and returns a list of its events
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

async function getUserNotParticiaingEvents(userId) {

  const user = await getUser(userId);
  let userGroups = await getUserGroups(userId);
  let events = await getUserEvents(userId);

  let userNotParticipantEvents = [];
  for(i = 0; i < userGroups.length; i++){
    let helperArray = await getGroupEvents(userGroups[i]._id);
    helperArray.forEach(event => {
      if (events.every(e => e._id.toString() !== event._id.toString())) {
        userNotParticipantEvents.push(event);
      }
    });
  }   
  return userNotParticipantEvents;
}



async function getEvents(eventIds) {
  return await db
    .collection("events")
    .find({ _id: { $in: eventIds } })
    .toArray();
}
async function getGroupEvents(groupId) {
  //Takes a group, and returns the list of events related to that group
  const group = await getGroup(groupId);

  return await db
    .collection("events")
    .find({ _id: { $in: group.eventIds } })
    .toArray();
}
async function getGroupSuggestedEvents(groupId) {
  //Returns a list of the suggested events related to the group.
  const group = await getGroup(groupId);

  return await db
    .collection("events")
    .find({ _id: { $in: group.suggestedEventIds } })
    .toArray();
}
function getCommonEvents() {
  //Should take user1 and user2 and return the events they have in common
}
async function getEvent(eventId) {
  //Takes event id and return event related to id
  return await db.collection("events").findOne({ _id: new ObjectId(eventId) });
}
async function getEventParticipants(eventId) {
  //Takes eventId, and return participants of event.
  const event = await getEvent(eventId);

  return await db
    .collection("users")
    .find({
      _id: { $in: event.participantIds },
    })
    .toArray();
}
async function removeUserFromEvent(userId, eventId) {
  //Removes user from event, takes id of both user and event
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $pull: {
        eventIds: new ObjectId(eventId),
      },
    }
  );
}
async function removeEventFromUser(eventId, userId) {
  // Removes event from user, takes id of both user and event.
  await db.collection("events").updateOne(
    { _id: new ObjectId(eventId) },
    {
      $pull: {
        participantIds: new ObjectId(userId),
      },
    }
  );
}
async function isUserInEvent(userId, eventId) {
  //Returns true or false, wether user is in event or not.
  const eventParticipants = await getEventParticipants(eventId);
  const user = await getUser(userId);

  return eventParticipants.filter(
    (participant) => participant.username == user.username
  ).length > 0
    ? true
    : false;
}
async function addUserToEvent(userId, eventId) {
  //Adds user to event in participantids
  await db.collection("events").updateOne(
    { _id: new ObjectId(eventId) },
    {
      $push: {
        participantIds: new ObjectId(userId),
      },
    }
  );
}
async function addEventToUser(eventId, userId) {
  //Adds event to user in eventIds
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $push: {
        eventIds: new ObjectId(eventId),
      },
    }
  );
}

async function isUserVotedToDelete(userId, eventId) {
  //Takes a user and a group, and return true or false whether user is in group or not
  const event = await getEvent(eventId);
  for (let i = 0; i < event.userIdsVotedDelete.length; i++) {
    if (event.userIdsVotedDelete[i].toString() == userId) {
      return true;
    }
  }
  return false;
}

//Creates a suggested event based on the groupId, and add it to the group.
async function addSuggestedEventToGroup(groupId) {
  const group = await getGroup(groupId);
  const eventTemplates = await db
    .collection("eventTemplates")
    .find({ interest: group.interest })
    .toArray();

  const randomTemplate = getRandomElement(eventTemplates);
  randomTemplate.groupId = groupId;
  randomTemplate.date = getRandomEventDate();
  randomTemplate._id = new ObjectId();

  const insertedRes = await addEvent(randomTemplate);

  await db.collection("groups").updateOne(
    { _id: groupId },
    {
      $push: {
        suggestedEventIds: insertedRes.insertedId,
      },
    }
  );
}

//add event to event database.
async function addEvent(event) {
  return await db.collection("events").insertOne(event);
}

//Adds event to a group.
async function addEventToGroup(eventId, groupId) {
  await db.collection("groups").updateOne(
    { _id: groupId },
    {
      $push: {
        eventIds: eventId,
      },
    }
  );
}

//Is hardcoded, but should return a random date in the current future (Maybe random choose saturday or sunday, and a random time of the day between 12 and 18)
function getRandomEventDate() {
  return {
    year: 2024,
    month: 7,
    day: 10,
    hour: 12,
    minute: 30,
  };
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
//Location functionality
async function getLocations() {
  //Returns a list of all locations
  try{
  
    const locations = await db.collection("locations").find().toArray();
    
    return locations;
  } catch (err) {
    console.error('Error querying locations: ', err);
  }
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
async function setUserInterests(userId, interests) {
  //Sets the interest of a user to  a list of interests.
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        interests: interests,
      },
    }
  );
}
async function getInterests() {
  //Returns a list of all interests.
  return await db.collection("interests").find().toArray();
}

module.exports = {
  getUserEvents,
  getUserNotParticiaingEvents,
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
  removeGroupFromUser,
  removeUserFromGroup,
  getGroupSuggestedEvents,
  getInterests,
  setUserInterests,
  getEventParticipants,
  getEvent,
  isUserInEvent,
  addEventToUser,
  addUserToEvent,
  removeUserFromEvent,
  removeEventFromUser,
  isUserVotedToDelete,
  getUser,
  getGroups,
  getEvents,
  addGroup,
  createGroupObject,
  emptyGroupsInterestAndRequirementsAmount,
  deleteAllButOneEmptyGroup,
  generateGroupName,
  repopulateGroups,
  getGroupDescription,
  addSuggestedEventToGroup,
};
