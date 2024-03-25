const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument, Decimal128 } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");
const { getGroupsBasedOnInterests } = require("../utils/discoverUtils");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  let groupsNotAttendedByUser = [];
  let sortedGroups = [];

  if (decodedUser == null) {
    return res.render("discover", { isLoggedIn: false });
  } else {
    try {
      const user = await db
        .collection("users")
        .findOne({ username: decodedUser.username });

      // Finds all groups
      await db
        .collection("groups")
        .find({
          _id: {
            $nin: user.groupIds,
          },
        })
        .forEach((group) => {
          groupsNotAttendedByUser.push(group);
        });

      for (let i = 0; i < user.interests.length; i++) {
        sortedGroups.push({ interest: user.interests[i], groups: [] });
        sortedGroups[i].groups = getGroupsBasedOnInterests(
          [user.interests[i]],
          user.interests.length*10,
          groupsNotAttendedByUser
        );
      }

      res.render("discover", { isLoggedIn: true, sortedGroups });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
    }
  }
});

router.get("/:id", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  let groupUsers = [];

  let participantsLocations = [];
  let participantsAges = [];
  let participantsGenders = [];

  if (decodedUser == null) {
    return res.render("discoverGroup", { isLoggedIn: false });
  } else {
    try {
      const group = await db
        .collection("groups")
        .findOne({ _id: new ObjectId(req.params.id) });

      const groupMemberAmount = group.userIds.length;
      group.groupMemberAmount = groupMemberAmount;

      await db
        .collection("users")
        .find({ _id: { $in: group.userIds } })
        .forEach((user) => {
          groupUsers.push(user);
        });

      res.render("discoverGroup", {
        isLoggedIn: true,
        group,
        participantsLocations,
      });
    } catch (error) {
      res.render("register", { isLoggedIn: true });
    }
  }
});

router.post("/:id/join", async (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    return res.render("discoverGroup", { isLoggedIn: false });
  } else {
    await db.collection("users").updateOne(
      { username: decodedUser.username },
      {
        $push: {
          groupIds: new ObjectId(req.params.id),
        },
      }
    );

    await db.collection("groups").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $push: {
          userIds: new ObjectId(decodedUser._id),
        },
      }
    );

    res.redirect(`/user/groups/${req.params.id}`);
  }
});

module.exports = router;
