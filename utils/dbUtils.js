const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");

let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});


// Common usecases of db interaction made easier.
async function getLoggedInUser() {}
async function getUserGroups() {}
async function getUserEvents() {}
async function setUserInfo(
  userId,
  username,
  age,
  location,
  firstName,
  lastName,
  bio
) {}
async function setUserInterests(userId, interests) {}
async function getGroup(groudId) {}
async function getUser(userId) {}
async function getGroupUsers(groupId) {}
async function getGroupEvents(groupId) {}
async function getInterests() {}
async function isUserInGroup(userId, groupId) {}
async function addMessageToGroup(message, groupId) {}
async function userLeaveGroup(userId, groupId) {}
async function removeUserFromGroup(userId, groupId) {}
async function removeGroupFromUser(groupId, userId) {}
function createEvent(
  eventName,
  date,
  description,
  location,
  groupId,
  participantIds
) {}
async function insertEvent(event) {}
async function addEventToGroup(eventId, groupId) {}
async function getEvent(eventId) {}
async function getUserEvents(userId) {}
async function getEventParticipants(eventId) {}
async function userLeaveEvent(userId, eventId) {}
async function removeUserFromEvent(userId, eventId) {}
async function removeEventFromUser(eventId, userId) {}
function sortUserGroupsBasedOnInterests(user) {}

async function userJoinGroup(userId, groupId) {}
async function addUserToGroup(userId, groupId) {}
async function addGroupToUser(groupId, userId) {}
async function getDiscoverGroups() {}
function createUser() {}
function isUsernameTaken(username) {}
function getCommonGroups() {}
function getCommonEvents() {}
