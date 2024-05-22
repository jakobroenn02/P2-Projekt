const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");
const { getLocations, isUsernameTaken } = require("../utils/dbUtils");
const { getAgeFromBirthDate } = require("../utils/generalUtil");

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
        usernameTaken: false,
        locations,
        underage: false, 
        passwordNoMatch: false, 
      });
    } else {
      res.render("register", { isLoggedIn: true, usernameTaken: false, underage: false, passwordNoMatch: false });
    }
  } catch (error) {
    console.log(error);
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

    // Checks if user is underage
    if (getAgeFromBirthDate(user.birth) < 18) {
      const locations = await getLocations();

      return res.render("register", {
        isLoggedIn: false,
        usernameTaken: false,
        locations,
        underage: true, 
        passwordNoMatch: false, 
      });
    }

    // Check if passwords match
    if (req.body.password != req.body.confirmedPassword) {
      const locations = await getLocations();

      return res.render("register", {
        isLoggedIn: false,
        usernameTaken: false,
        locations,
        underage: false, 
        passwordNoMatch: true, 
      });
    }

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
        usernameTaken: true,
        locations,
        underage: false, 
        passwordNoMatch: false, 
      });
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

module.exports = router;
