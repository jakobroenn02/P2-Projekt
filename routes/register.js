const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

router.get("/", (req, res) => {
  if (req.cookies.token == null) {
    return res.render("register", { isLoggedIn: false });
  } else {
    res.render("register", { isLoggedIn: true });
  }
});

router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: { firstName: req.body.firstName, lastName: req.body.lastName },
      password: hashedPassword,
      bio: "",
      age: 0,
      location: "",
      groupIds: [],
      interests: [],
      eventIds: [],
      username: req.body.username,
    };

    db.collection("users")
      .insertOne(user)
      .then(() => {
        const token = jwt.sign(user, process.env.JWTSECRET, {
          expiresIn: "30m",
        });
  
        //sets cookie in browser
        res.cookie("token", token, {
          httpOnly: true,
        });
        res.redirect("/");
      });
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
