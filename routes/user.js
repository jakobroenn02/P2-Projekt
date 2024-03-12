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
  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    res.render("user", { isLoggedIn: false });
  } else {
    res.render("user", { isLoggedIn: true });
  }
});

router.delete("/delete-profile", (req, res) => {
  let decodedUser;
  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    res.status(401).send("Not authorized");
  } else {
    db.collection("users")
      .deleteOne({ username: decodedUser.username })
      .then(() => {
        res.clearCookie("token");
        res.status(200).send("Profile deleted");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting profile");
      });
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

router.get("/groups/:id", async (req, res) => {
  let decodedUser;
  let groupUsers = [];
  let userIds = [];

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    res.render("group", { isLoggedIn: false });
  } else {
    const group = await db
      .collection("groups")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (group.hasOwnProperty("userIds")) {
      userIds = group.userIds.map((userId) => new ObjectId(userId));
    }

    groupUsers = await db
      .collection("users")
      .find({ _id: { $in: userIds } })
      .toArray();

    const loggedInUserInGroup = groupUsers.filter((user) => {
      return user.username == decodedUser.username;
    });

    if (loggedInUserInGroup.length >= 1) {
      res.render("group", {
        hasAccess: true,
        isLoggedIn: true,
        groupUsers,
        group,
      });
    } else {
      res.render("group", { hasAccess: false, isLoggedIn: true });
    }
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

    db.collection("users").updateOne(
      { username: decodedUser.username },
      {
        $set: {
          interests: selectedInterests,
        },
      }
    );

    user = await db
      .collection("users")
      .findOne({ username: decodedUser.username });

    res.redirect("/user/interests");
  }
});

router.delete("/interests", (req, res) => {});

module.exports = router;
