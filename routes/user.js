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

router.get("/", (req, res) => {
  let decodedUser;

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    res.render("user", { isLoggedIn: false });
  } else {
    res.render("user", { isLoggedIn: true, user: decodedUser });
  }
});

router.post("/", async (req, res) => {
  let decodedUser;

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    res.render("user", { isLoggedIn: false });
  } else {
    await db.collection("users").updateMany(
      { _id: new ObjectId(req.body.userId) },
      {
        $set: {
          username: req.body.userUsername,
          age: req.body.userAge,
          location: req.body.userLocation,
          "name.firstName": req.body.userFirstName,
          "name.lastName": req.body.userLastName,
        },
      }
    );
    decodedUser.username = req.body.userUsername;
    res.clearCookie("token");
    return res.redirect("/login");
  }
});

router.delete("/:username", (req, res) => {
  let decodedUser;
  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    res.status(401).send("Not authorized");
  } else {
    if (req.params.username == decodedUser.username) {
      db.collection("users")
        .deleteOne({ username: decodedUser.username })
        .then(() => {
          res.clearCookie("token");
          res.redirect("/");
        });
    }
  }
});

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
router.get("/interests", (req, res) => {
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
        res.render("interests", { isLoggedIn: true, user });
      });
  }
});

module.exports = router;
