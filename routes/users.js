const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  commonGroupsIds,
  commonEventsIds,
} = require("../utils/publicUserUtils.js");
const { verifyToken } = require("../utils/cookiesUtils.js");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/:id", async (req, res) => {
  let decodedUser = verifyToken(res, req);
  let commonGroups = [];
  let commonEvents = [];

  if (decodedUser == null) {
    res.render("publicUserProfile", { isLoggedIn: false });
  } else {
    try {
      const userId = req.params.id;
      const publicUser = await db
        .collection("users")
        .findOne({ _id: new ObjectId(userId) });

      const ownUser = await db
        .collection("users")
        .findOne({ _id: new ObjectId(decodedUser._id) });

      const usersCommonGroupsIds = commonGroupsIds(publicUser, ownUser);
      const usersCommonEventsIds = commonEventsIds(publicUser, ownUser);

      await db
        .collection("groups")
        .find({ _id: { $in: usersCommonGroupsIds } })
        .forEach((group) => {
          commonGroups.push(group);
        });
      await db
        .collection("events")
        .find({ _id: { $in: usersCommonEventsIds } })
        .forEach((event) => {
          commonEvents.push(event);
        });

      if (publicUser && commonGroups.length >= 1) {
        res.render("publicUserProfile", {
          isLoggedIn: true,
          publicUser,
          commonEvents,
          commonGroups,
          user: decodedUser,
        });
      } else if (publicUser) {
        res.render("errorPage", {
          isLoggedIn: true,
          errorMessage: "Access denied",
        });
      }
    } catch (error) {
      res.render("errorPage", {
        isLoggedIn: true,
        errorMessage: "User not found",
      });
    }
  }
});

module.exports = router;
