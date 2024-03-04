const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");

let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/", (req, res) => {
  const loggedInId = "65e03e4f361d8c19ff395a8f";
  let groups = [];

  db.collection("users")
    .findOne({ _id: new ObjectId(loggedInId) })
    .then((user) => {
      db.collection("groups")
        .find({
          _id: {
            $in: user.groupIds,
          },
        })
        .forEach((group) => {
          groups.push(group);
        })
        .then(() => {
          res.render("groups", groups);
        });
    });
});

module.exports = router;
