const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument, Decimal128 } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  let groupSeparationList = [];


  if (decodedUser == null) {
    return res.render("index", { isLoggedIn: false });
  } else {
    try {
      const user = await db
        .collection("users")
        .findOne({ username: decodedUser.username });

      for await (interest of user.interests) {
        let groupSeparation = { interest: interest, groups: [] };
        await db
          .collection("groups")
          .find({ interest: interest })
          .forEach((group) => {
            groupSeparation.groups.push(group);
          })
          .then(() => {
            groupSeparationList.push(groupSeparation);
          });
      }


      res.render("discover", { isLoggedIn: true, groupSeparationList });
    } catch (error) {
      res.render("register", { isLoggedIn: true });
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
