const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");
const { getGroupsBasedOnInterests } = require("../utils/discoverUtils");
const {
  getLoggedInUser,
  getUserEvents,
  getUserGroups,
  getUserUnattendedGroups,
} = require("../utils/dbUtils");

// Connecting to database
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

//routes
router.get("/", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      return res.redirect("/login");
    } else {
      const user = await getLoggedInUser(token);
      const userEvents = await getUserEvents(token._id);
      const userGroups = await getUserGroups(token._id);

      // Used to find discover groups
      let groupsNotAttendedByUser = await getUserUnattendedGroups(token._id);

      // Gets 10 groups, equally many from each interest you have
      const discoverGroups = getGroupsBasedOnInterests(
        user.interests,
        10,
        groupsNotAttendedByUser
      );

      res.render("index", {
        isLoggedIn: true,
        userEvents,
        userGroups,
        discoverGroups,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

module.exports = router;
