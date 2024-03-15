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


module.exports = router;