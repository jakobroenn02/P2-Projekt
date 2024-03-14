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
    return res.render("findGroup", { isLoggedIn: false });
  } else {
    const group = await db
      .collection("groups")
      .findOne({ _id: new ObjectId(req.params.id) });

    const groupMemberAmount = group.userIds.length
    group.groupMemberAmount = groupMemberAmount
    res.render("findGroup", { isLoggedIn: true, group});
  }
});

module.exports = router;
