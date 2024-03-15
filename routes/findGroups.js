const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const jwt = require("jsonwebtoken");

//connet to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

//routes
router.get("/", async (req, res) => {
  let decodedUser

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    return res.render("index", { isLoggedIn: false });
  } else {
    await db
    .collection("groups")
    .find({})
    forEach(group => {
      allgroups.push(group);
    });
  }
})


module.exports = router;