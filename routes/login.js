const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/", (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    return res.render("login", { isLoggedIn: false, hasTypeWrong: false });
  } else {
    try {
      res.render("login", { isLoggedIn: true, hasTypeWrong: false });
    } catch (error) {
      res.render("register", { isLoggedIn: true });
    }
  }
});

router.post("/", async (req, res) => {
  let loggedInUser = await db
    .collection("users")
    .findOne({ username: req.body.username });

  if (!loggedInUser) {
    return res.render("login", { isLoggedIn: false, hasTypeWrong: true });
  }

  try {
    const passMatch = await bcrypt.compare(
      req.body.password,
      loggedInUser.password
    );

    if (passMatch) {
      //Creates jwt token

      const token = jwt.sign(logedInUser, process.env.JWTSECRET, {
        expiresIn: "3h",
      });

      //sets cookie in browser
      res.cookie("token", token, {
        httpOnly: true,
      });

      res.redirect("/");
    } else {
      return res.render("login", { isLoggedIn: false, hasTypeWrong: true });
    }
  } catch {
    res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/login");
});

module.exports = router;
