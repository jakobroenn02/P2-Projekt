const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");

let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

//routes
router.get("/", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  let groups = [];
  let groupsNames = [];
  let allgroups = [];
  let events = [];

 

  if (decodedUser == null) {
    return res.redirect("/login");
  } else {
    try {
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
              groupsNames.push(group.groupName);
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
                    groupsNames,
                  });
                });
            });
        });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
    }
  }
});

module.exports = router;
