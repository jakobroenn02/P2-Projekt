const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

//routes

router.get("/", (req, res) => {
  const logedInId = "65e03e4f361d8c19ff395a8f";

  db.collection("users")
    .findOne({ _id: new ObjectId(logedInId) })
    .then((user) => {
      res.render("user", { user });
    });
});

router.get("/events", (req, res) => {
  const logedInId = "65e03e4f361d8c19ff395a8f";
  let events = [];

  db.collection("users")
    .findOne({ _id: new ObjectId(logedInId) })
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
          res.render("user", { events });
        });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.collection("users")
    .findOne({ _id: new ObjectId(id) })
    .then((user) => {
      res.render("user", { user });
    });
});

router.post("/", (req, res) => {
  const user = req.body;
  db.collection("users")
    .insertOne(user)
    .then((result) => {
      res.render("user");
    });
});

module.exports = router;
