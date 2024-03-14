const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const jwt = require("jsonwebtoken");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/:id", async (req, res) => {
  let decodedUser;

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
    res.render("discoverGroup", { isLoggedIn: true, group });
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
