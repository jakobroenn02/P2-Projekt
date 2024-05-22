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
  addGroup,
  createGroupObject,
  emptyGroupsInterestAndRequirementsAmount,
  randomGroupNameGenerator,
  getGroupDescription,
} = require("../utils/dbUtils");
const { MAX_GROUPS_AMOUNT, MAX_MEMBERS } = require("../utils/constUtils");

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
      const user = await getLoggedInUser(token);
      // checks if user is already part of the group
      if (await isUserInGroup(token._id, req.params.groupId)) {
        return res.redirect(`/user/groups/${req.params.groupId}`);
      }
      const group = await getGroup(req.params.groupId);
      const groupUsers = await getGroupUsers(req.params.groupId);
      const groupEvents = await getGroupEvents(req.params.groupId);
      res.render("discoverGroup", {
        isLoggedIn: true,
        group,
        groupEvents,
        user,
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
    const user = await getLoggedInUser(token);
    const group = await getGroup(req.params.groupId);

    if (token == null) {
      return res.render("discoverGroup", { isLoggedIn: false });
    } else {
      //Checks if user is part of more than max amounts of groups allowed to be part of.
      if (user.groupIds.length >= MAX_GROUPS_AMOUNT) {
        return res.render("errorPage", {
          errorMessage: `You can only join a maximum of ${MAX_GROUPS_AMOUNT} groups`,
        });
      }

      //Checks if user is already part of the group (If user joins group and goes to previous page)
      if (await isUserInGroup(token._id, req.params.groupId)) {
        return res.redirect(`/user/groups/${req.params.groupId}`);
      }

      await addGroupToUser(req.params.groupId, token._id);
      await addUserToGroup(token._id, req.params.groupId);

      // Checks to create new groups:
      if (group.userIds.length + 1 == 1) {
        // If user joined an empty group. - We create one more empty group
        //Check for amounts of empty group just to be safe.
        if (
          (await emptyGroupsInterestAndRequirementsAmount(
            group.interest,
            group.requirements
          )) == 0
        ) {
          await addGroup(
            createGroupObject(
              group.interest,
              group.location,
              group.requirements
            )
          );
        }
      }

      return res.redirect(`/user/groups/${req.params.groupId}`);
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

module.exports = router;
