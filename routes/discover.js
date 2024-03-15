const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument, Decimal128 } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const jwt = require("jsonwebtoken");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/", async (req, res) => {
  let decodedUser;
  let groupSeparationList = [];

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    return res.render("index", { isLoggedIn: false });
  } else {
    const user = await db.collection("users").findOne({ username: decodedUser.username });

    for await (interest of user.interests) {
      let groupSeparation = { interest: interest, groups: [] }
      await db.collection("groups").find({ interest: interest }).forEach(group => {
        groupSeparation.groups.push(group)
      }).then(() => {
        console.log(1)
        groupSeparationList.push(groupSeparation)
      })
    }

    console.log(groupSeparationList)





    res.render("discover", { isLoggedIn: true, groupSeparationList })
  }
})


router.get("/:id", async (req, res) => {
  let decodedUser;
  let groupUsers = [];

  let participantsLocations = [];
  let participantsAges = [];
  let participantsGenders = [];

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    return res.render("discoverGroup", { isLoggedIn: false });
  } else {
    const group = await db
      .collection("groups")
      .findOne({ _id: new ObjectId(req.params.id) });

    const groupMemberAmount = group.userIds.length;
    group.groupMemberAmount = groupMemberAmount;


    await db.collection("users")
      .find({ _id: { $in: group.userIds } })
      .forEach((user) => {
        groupUsers.push(user);
      });
    console.log(groupUsers);

    res.render("discoverGroup", {
      isLoggedIn: true,
      group,
      participantsLocations,
    });
  }
});

router.post("/:id/join", async (req, res) => {
  let decodedUser;

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

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
