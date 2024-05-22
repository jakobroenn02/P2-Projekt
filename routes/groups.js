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
router.post("/create", async (req, res) => {
  try {


    


  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

module.exports = router;
