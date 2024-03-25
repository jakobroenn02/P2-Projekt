const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");
const { getGroupsBasedOnInterests } = require("../utils/discoverUtils");

let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

//routes
router.get("/", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  let userGroups = [];
  let groupsNotAttendedByUser = [];
  let events = [];

  if (decodedUser == null) {
    return res.redirect("/login");
  } else {
    try {
      // Finds logged in user
      const user = await db
        .collection("users")
        .findOne({ username: decodedUser.username });

      //Finds all events user is signed up for.
      await db
        .collection("events")
        .find({
          _id: {
            $in: user.eventIds,
          },
        })
        .forEach((event) => {
          events.push(event);
        });

      await db
        .collection("groups")
        .find({
          _id: {
            $in: user.groupIds,
          },
        })
        .forEach((group) => {
          userGroups.push(group);
        });

      // Finds all groups
      await db
        .collection("groups")
        .find({
          _id: {
            $nin: user.groupIds,
          },
        })
        .forEach((group) => {
          groupsNotAttendedByUser.push(group);
        });

      const discoverGroups = getGroupsBasedOnInterests(
        user.interests,
        10,
        groupsNotAttendedByUser
      );

      res.render("index", {
        groupsNotAttendedByUser,
        isLoggedIn: true,
        events,
        userGroups,
        discoverGroups,
      });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
    }
  }
});

module.exports = router;
