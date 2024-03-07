const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/", (req, res) => {
  let decodedUser;

  if (req.cookies.token != null) {
    decodedUser = jwt.verify(req.cookies.token, process.env.JWTSECRET);
  }

  if (decodedUser == null) {
    return res.render("login", { isLoggedIn: false });
  } else {
    res.render("login", { isLoggedIn: true });
  }
});

router.post("/", async (req, res) => {
  let logedInUser = await db
    .collection("users")
    .findOne({ username: req.body.username });

  if (!logedInUser) {
    return res.status(400).send("cannot find user");
  }

  try {
    const passMatch = await bcrypt.compare(
      req.body.password,
      logedInUser.password
    );

    if (passMatch) {
      //Creates jwt token
      const token = jwt.sign(logedInUser, process.env.JWTSECRET, {
        expiresIn: "24h",
      });

      //sets cookie in browser
      res.cookie("token", token, {
        httpOnly: true,
      });

      res.redirect("/");
    } else {
      res.send("Wrong password");
    }
  } catch {
    res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

module.exports = router;
