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
const {
  getUser,
  getLoggedInUser,
  getGroup,
  getGroups,
  getEvents,
} = require("../utils/dbUtils.js");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/:id", async (req, res) => {
  try {
    let token = verifyToken(res, req);

    if (token == null) {
      res.render("publicUserProfile", { isLoggedIn: false });
    } else {
      const publicUser = await getUser(req.params.id);
      const user = await getLoggedInUser(token);

      const commonGroups = await getGroups(commonGroupsIds(publicUser, user));
      const commonEvents = await getEvents(commonEventsIds(publicUser, user));

      if (publicUser && commonGroups.length >= 1) {
        res.render("publicUserProfile", {
          isLoggedIn: true,
          publicUser,
          commonEvents,
          commonGroups,
          user,
        });
      } else {
        res.render("errorPage", {
          isLoggedIn: true,
          errorMessage: "Access denied",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

module.exports = router;
