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
  let decodedUser;
  let events = [];

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    res.render("userEvents", { isLoggedIn: false });
  } else {
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
            res.render("userEvents", { isLoggedIn: true, events });
          });
      });
  }
});

router.get("/groups", (req, res) => {
  let groups = [];
  let decodedUser;

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    res.render("groups", { isLoggedIn: false });
  } else {
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
  }
});
router.get("/interests", async (req, res) => {
  let decodedUser;
  let allInterests = [];
  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    res.render("interests", { isLoggedIn: false });
  } else {
    await db
      .collection("interests")
      .find()
      .forEach((interest) => {
        allInterests.push(interest);
      });

    let user = await db
      .collection("users")
      .findOne({ username: decodedUser.username });

    res.render("interests", { isLoggedIn: true, allInterests, user });
  }
});

router.post("/interests", async (req, res) => {
  let decodedUser;
  const selectedInterests = Object.values(req.body);
  let allInterests = [];

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }
  if (decodedUser != null) {
    await db
      .collection("interests")
      .find()
      .forEach((interest) => {
        allInterests.push(interest);
      });

    let user = await db
      .collection("users")
      .findOne({ username: decodedUser.username });

    selectedInterests.forEach((interest) => {
      if (!user.interests.includes(interest)) {
        db.collection("users").updateOne(
          { username: decodedUser.username },
          {
            $push: {
              interests: interest,
            },
          }
        );
      }
    });

    user = await db
      .collection("users")
      .findOne({ username: decodedUser.username });

    res.render("interests", { isLoggedIn: true, allInterests, user });
  }
});

router.delete("/interests", (req, res) => {
  
});

module.exports = router;
