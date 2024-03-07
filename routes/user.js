const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

//routes

router.get("/events", (req, res) => {
  const decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  let events = [];

  db.collection("users")
    .findOne({ username: decodedUser.username })
    .then((user) => {
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
          console.log(events);
          res.render("userEvents", { isLoggedIn: true, events });
        });
    });
});

router.get("/groups", (req, res) => {
  const decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  let groups = [];

  db.collection("users")
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
          res.render("groups", { isLoggedIn: true, groups });
        });
    });
});
router.get("/interests", (req, res)=> {
  const decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);

  db.collection("users")
    .findOne({username: decodedUser.username })
    .then((user)=> {
      res.render("interests", {isLoggedIn:true, user});
    })
});


module.exports = router;
