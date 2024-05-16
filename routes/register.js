const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");
const { getLocations, isUsernameTaken } = require("../utils/dbUtils");

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
      const locations = await getLocations();
      return res.render("register", {
        isLoggedIn: false,
        hasTypeWrong: false,
        locations,
      });
    } else {
      res.render("register", { isLoggedIn: true, hasTypeWrong: false });
    }
  } catch (error) {
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/", async (req, res) => {
  try {
    // encrypting password by hashing it
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Creates a user object, that will be added to the user database.
    const user = {
      name: { firstName: req.body.firstName, lastName: req.body.lastName },
      password: hashedPassword,
      bio: "",
      birth: {
        day: req.body.birthDay,
        month: req.body.birthMonth,
        year: req.body.birthYear,
      },
      location: req.body.location,
      groupIds: [],
      interests: [],
      eventIds: [],
      username: req.body.username,
      profileImageId: 1,
      gender: req.body.gender,
    };

    // Checks if username is taken
    if (!(await isUsernameTaken(req.body.username))) {
      //Inserts user in db
      const insertedUser = await db.collection("users").insertOne(user);

      //Creates a token with id of user
      const token = jwt.sign(
        { _id: insertedUser.insertedId },
        process.env.JWTSECRET,
        {
          expiresIn: "3h",
        }
      );

      //Adds token to cookies
      res.cookie("token", token, {
        httpOnly: true,
      });

      res.redirect("/user/interests");
    } else {
      const locations = await getLocations();

      return res.render("register", {
        isLoggedIn: false,
        hasTypeWrong: true,
        locations,
      });
    }
  } catch (error) {
    res.render("errorPage", { errorMessage: error });
  }
});

module.exports = router;
