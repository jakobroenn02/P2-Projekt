const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const jwt = require("jsonwebtoken");

let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

//routes
router.get("/", async (req, res) => {
  let decodedUser;
  let groups = [];
  let allgroups = [];
  let events = [];

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    return res.render("index", { isLoggedIn: false });
  } else {
    await db
      .collection("groups")
      .find({})
      .forEach((group) => {
        allgroups.push(group);
      });

    await db
      .collection("users")
      .findOne({ username: decodedUser.username })
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
            db.collection("events")
              .find({
                _id: {
                  $in: user.eventIds,
                },
              })
              .forEach((event) => {
                events.push(event);
              })
              .then(() => {
                res.render("index", {
                  isLoggedIn: true,
                  groups,
                  events,
                  allgroups,
                });
              });
          });
      });
  }
});

module.exports = router;
