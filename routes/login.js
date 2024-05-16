const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");
const { getLoggedInUser } = require("../utils/dbUtils");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/", async (req, res) => {
  try {
    const token = verifyToken(res, req);
    if (token == null) {
      return res.render("login", { isLoggedIn: false, hasTypeWrong: false });
    } else {
      const user = await getLoggedInUser(token);
      res.render("login", { isLoggedIn: true, hasTypeWrong: false, user });
    }
  } catch (error) {
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/", async (req, res) => {
  try {
    //Login via username
    let user = await db
      .collection("users")
      .findOne({ username: req.body.username });

    // If user cant be found, we give them an error message "Wrong u... or passsword"
    if (!user) {
      return res.render("login", { isLoggedIn: false, hasTypeWrong: true });
    }

    // check if pass is correct return true or false.
    const passMatch = await bcrypt.compare(req.body.password, user.password);

    if (passMatch) {
      //Creates jwt token, with only user _id
      const token = jwt.sign({ _id: user._id }, process.env.JWTSECRET, {
        expiresIn: "3h",
      });

      //sets token in browser cookies
      res.cookie("token", token, {
        httpOnly: true,
      });

      res.redirect("/");
    } else {
      // If pass is wrong be give error "Wront u... or password"
      return res.render("login", { isLoggedIn: false, hasTypeWrong: true });
    }
  } catch (error) {
    res.render("errorPage", { errorMessage: error });
  }
});

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    return res.redirect("/login");
  } catch (error) {
    res.render("errorPage", { errorMessage: error });
  }
});

module.exports = router;
