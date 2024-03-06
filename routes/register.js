const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("register");
});
<<<<<<< Updated upstream
=======

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
        res.redirect("/interests");
      });
  } catch {
    res.status(500).send();
  }
});

>>>>>>> Stashed changes
module.exports = router;

