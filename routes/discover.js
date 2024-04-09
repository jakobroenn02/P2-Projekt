const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument, Decimal128 } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");
const { getGroupsBasedOnInterests } = require("../utils/discoverUtils");
const { render } = require("ejs");
const {
  getLoggedInUser,
  getUserUnattendedGroups,
  getGroup,
  isUserInGroup,
  getGroupUsers,
  getGroupEvents,
  addGroupToUser,
  addUserToGroup,
} = require("../utils/dbUtils");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/", async (req, res) => {
  try {
    const token = verifyToken(res, req);
    let sortedGroups = [];
    if (token == null) {
      return res.render("discover", { isLoggedIn: false });
    } else {
      const user = await getLoggedInUser(token);
      const groupsNotAttendedByUser = await getUserUnattendedGroups(token._id);

      //Sorted groups are objects: {interest: "", groups:[]}
      //Here we loop through all sorted groups, and gets 10 random groups per interest.
      for (let i = 0; i < user.interests.length; i++) {
        sortedGroups.push({ interest: user.interests[i], groups: [] });
        sortedGroups[i].groups = getGroupsBasedOnInterests(
          [user.interests[i]],
          user.interests.length * 10,
          groupsNotAttendedByUser
        );
      }

      res.render("discover", {
        isLoggedIn: true,
        sortedGroups,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.get("/:groupId", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      return res.render("discoverGroup", { isLoggedIn: false });
    } else {
      // checks if user is already part of the group
      if (await isUserInGroup(token._id, req.params.groupId)) {
        res.redirect(`/user/groups/${req.params.groupId}`);
      }
      const group = await getGroup(req.params.groupId);
      const groupUsers = await getGroupUsers(req.params.groupId);
      const groupEvents = await getGroupEvents(req.params.groupId);
      res.render("discoverGroup", {
        isLoggedIn: true,
        group,
        groupEvents,
        user: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/:groupId/join", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      return res.render("discoverGroup", { isLoggedIn: false });
    } else {
      await addGroupToUser(req.params.groupId, token._id);
      await addUserToGroup(token._id, req.params.groupId);

      res.redirect(`/user/groups/${req.params.groupId}`);
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

module.exports = router;
