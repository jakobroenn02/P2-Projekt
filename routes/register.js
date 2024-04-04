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
    return res.render("register", { isLoggedIn: false });
  } else {
  }
  try {
    res.render("register", { isLoggedIn: true });
  } catch (error) {
    res.render("errorPage", { errorMessage: "Error" });
  }
});

router.post("/", async (req, res) => {
  let allLocations = [];
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: { firstName: req.body.firstName, lastName: req.body.lastName },
      password: hashedPassword,
      bio: "",
      age: 0,
      location: req.body.location,
      groupIds: [],
      interests: [],
      eventIds: [],
      username: req.body.username,
      profileImageId: 1,
      gender: req.body.gender,
    };
    db.collection("users")
      .insertOne(user)
      .then(() => {
        const token = jwt.sign(user, process.env.JWTSECRET, {
          expiresIn: "60m",
        });

        //sets cookie in browser
        res.cookie("token", token, {
          httpOnly: true,
        });
        res.redirect("/user/interests");
      });

       await db.collection("Location")
        .find()
        .forEach((location) => {
          allLocations.push(location);
        });

  } catch {
    res.render("errorPage", { errorMessage: "Error" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

module.exports = router;
