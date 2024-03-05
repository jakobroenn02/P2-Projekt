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

//routes
router.get("/", (req, res) => {
  let groups = [];
  let events = [];

  const logedInId = "65e03e4f361d8c19ff395a8f";

  db.collection("users")
    .findOne({ _id: new ObjectId(logedInId) })
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
              res.render("index", { groups, events });
            });
        });
    });
});



module.exports = router;
