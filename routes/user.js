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
  const decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);

  db.collection("users")
    .findOne({ username: decodedUser.username })
    .then((user) => {
      console.log(user);
      res.render("user", { user });
    });
});

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
          res.render("userEvents", { events });
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
          res.render("groups", { groups });
        });
    });
});

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
      password: hashedPassword,
    };

    db.collection("users")
      .insertOne(user)
      .then(() => {
        res.render("user");
      });
  } catch {
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  //Tries to find user
  let logedInUser = await db
    .collection("users")
    .findOne({ username: req.body.username });

  if (!logedInUser) {
    return res.status(400).send("cannot find user");
  }

  try {
    const passMatch = await bcrypt.compare(
      req.body.password,
      logedInUser.password
    );

    if (passMatch) {
      //Creates jwt token
      const token = jwt.sign(logedInUser, process.env.JWTSECRET, {
        expiresIn: "30m",
      });

      //sets cookie in browser
      res.cookie("token", token, {
        httpOnly: true,
      });

      res.render("user");
    } else {
      res.send("not allowed");
    }
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
