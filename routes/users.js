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
  
  let users = [];

  db.collection("users")
    .find()
    .sort()
    .forEach(user => {
      users.push(user)
    })
    .then(() => {
      res.render("users", {users});
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.collection("users")
    .findOne({_id: new ObjectId(id)})
    .then((user) => {
      res.render("user", {user});
    });
});

router.post("/", (req, res) => {
  const user = req.body;
  db.collection("users")
    .insertOne(user)
    .then((result) => {
      res.render("user")
    });
});

module.exports = router;
