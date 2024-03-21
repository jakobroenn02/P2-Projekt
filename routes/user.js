const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
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

//routes
router.get("/", (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("user", { isLoggedIn: false });
  } else {
    try {
      res.render("user", { isLoggedIn: true, user: decodedUser });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
    }
  }
});

router.post("/bio/update", async (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("user", { isLoggedIn: false });
  } else {
    await db.collection("users").updateMany(
      { _id: new ObjectId(req.body.userId) },
      {
        $set: {
          bio: req.body.userBio,
        },
      }
    );
    decodedUser.username = req.body.userUsername;
    res.clearCookie("token");
    return res.redirect("/login");
  }
});

router.post("/info/update", async (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("user", { isLoggedIn: false });
  } else {
    await db.collection("users").updateMany(
      { _id: new ObjectId(req.body.userId) },
      {
        $set: {
          username: req.body.userUsername,
          age: req.body.userAge,
          location: req.body.userLocation,
          "name.firstName": req.body.userFirstName,
          "name.lastName": req.body.userLastName,
        },
      }
    );
    decodedUser.username = req.body.userUsername;
    res.clearCookie("token");
    return res.redirect("/login");
  }
});

router.get("/events", (req, res) => {
  const decodedUser = verifyToken(res, req);
  let events = [];

  if (decodedUser == null) {
    res.render("userEvents", { isLoggedIn: false });
  } else {
    try {
      db.collection("users")
        .findOne({ username: decodedUser.username })
        .then((user) => {
          db.collection("events")
            .find({
              _id: {
                $in: user.eventIds,
              },
            })
            .forEach((event) => {
              events.push(event);
            })
            .then(() => {
              res.render("userEvents", { isLoggedIn: true, events });
            });
        });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
    }
  }
});

router.get("/groups", (req, res) => {
  let groups = [];
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("groups", { isLoggedIn: false });
  } else {
    try {
      db.collection("users")
        .findOne({ username: decodedUser.username })
        .then((user) => {
          db.collection("groups")
            .find({
              _id: {
                $in: user.groupIds,
              },
            })
            .forEach((group) => {
              groups.push(group);
            })
            .then(() => {
              res.render("groups", { isLoggedIn: true, groups });
            });
        });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
    }
  }
});

router.get("/groups/:id", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  let groupUsers = [];
  let userIds = [];

  if (decodedUser == null) {
    res.render("group", { isLoggedIn: false });
  } else {
    try {
      const group = await db
        .collection("groups")
        .findOne({ _id: new ObjectId(req.params.id) });

      if (group.hasOwnProperty("userIds")) {
        userIds = group.userIds.map((userId) => new ObjectId(userId));
      }

      groupUsers = await db
        .collection("users")
        .find({ _id: { $in: userIds } })
        .toArray();

      const loggedInUserInGroup = groupUsers.filter((user) => {
        return user.username == decodedUser.username;
      });

      if (loggedInUserInGroup.length >= 1) {
        res.render("group", {
          isLoggedIn: true,
          groupUsers,
          group,
          user: decodedUser,
        });
      } else {
        res.render("errorPage", {
          errorMessage: "Access denied",
          isLoggedIn: true,
        });
      }
    } catch (error) {
      res.render("errorPage", {
        errorMessage: "Group not found",
      });
    }
  }
});

router.post("/groups/:id", async (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("group", { isLoggedIn: false });
  } else {
    await db.collection("groups").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $push: {
          messages: {
            messageText: req.body.messageText,
            authorName: req.body.authorName,
            authorId: new ObjectId(req.body.authorId),
            createdAt: {
              year: req.body.createdAt.year,
              month: req.body.createdAt.month,
              day: req.body.createdAt.day,
              hour: req.body.createdAt.hour,
              minute: req.body.createdAt.minute,
            },
          },
        },
      }
    );
  }
});

router.get("/groups/:id/events", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  let currentGroup;
  let groupEventsIds = [];
  let groupEvents = [];

  if (decodedUser == null) {
    res.render("groupEvents", { isLoggedIn: false });
  } else {
    try {
      currentGroup = await db
        .collection("groups")
        .findOne({ _id: new ObjectId(req.params.id) });

      groupEventsIds = currentGroup.eventIds;

      await db
        .collection("events")
        .find({})
        .forEach((event) => {
          for (let i = 0; i < groupEventsIds.length; i++) {
            if (event._id == groupEventsIds[i]) {
              groupEvents.push(event);
            }
          }
        })
        .then(() => {
          res.render("groupEvents", {
            isLoggedIn: true,
            currentGroup,
            groupEvents,
          });
        });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
    }
  }
});

router.get("/interests", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  let allInterests = [];

  if (decodedUser == null) {
    res.render("interests", { isLoggedIn: false });
  } else {
    try {
      await db
        .collection("interests")
        .find()
        .forEach((interest) => {
          allInterests.push(interest);
        });

      let user = await db
        .collection("users")
        .findOne({ username: decodedUser.username });

      res.render("interests", { isLoggedIn: true, allInterests, user });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
    }
  }
});

router.post("/interests", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  const selectedInterests = Object.values(req.body);
  let allInterests = [];

  if (decodedUser != null) {
    await db
      .collection("interests")
      .find()
      .forEach((interest) => {
        allInterests.push(interest);
      });

    let user = await db
      .collection("users")
      .findOne({ username: decodedUser.username });

    db.collection("users").updateOne(
      { username: decodedUser.username },
      {
        $set: {
          interests: selectedInterests,
        },
      }
    );

    user = await db
      .collection("users")
      .findOne({ username: decodedUser.username });

    res.redirect("/user/interests");
  }
});

router.get("/events/:eventId", (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("eventinfo", { isLoggedIn: false });
  } else {
    try {
      db.collection("events")
        .findOne({ _id: new ObjectId(req.params.eventId) })
        .then((event) => {
          db.collection("users")
            .find({
              _id: { $in: event.participantIds.map((id) => new ObjectId(id)) },
            })
            .toArray()
            .then((users) => {
              event.participantIds = users.map((user) => user.username);
              db.collection("events")
                .find({
                  participantIds: decodedUser._id,
                })
                .toArray()
                .then((events) => {
                  res.render("eventinfo", { isLoggedIn: true, event, events });
                });
            });
        });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
    }
  }
});

router.delete("/leave-event", (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("eventinfo", { isLoggedIn: false });
  } else {
    const eventID = new ObjectId(req.body.eventId);
    const userId = new ObjectId(decodedUser._id);
    db.collection("events")
      .updateOne(
        { _id: eventID },
        {
          $pull: { participantIds: userId.toString() },
        }
      )
      .then(() => {
        db.collection("users")
          .updateOne(
            { _id: userId },
            {
              $pull: { eventIds: eventID },
            }
          )
          .then(() => {
            res.status(200).send("Event left");
          })
          .catch((err) => {
            res.status(500).send("Error while leaving event!");
          });
      });
  }
});

module.exports = router;
