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
router.get("/", async (req, res) => {
  const decodedUser = verifyToken(res, req);

    if (decodedUser == null) {
      res.render("user", { isLoggedIn: false });
    } else {
      const user = await db.collection("users").findOne({username: req.body.userUsername});
        if(user && user._id.toString() !== req.body.userId){
          return res.status(400).json({message: "Username already taken"});
        } else {
          try {
            const user = await db
              .collection("users")
              .findOne({ username: decodedUser.username });

            res.render("user", { isLoggedIn: true, user, profileImageId: user.profileImageId,Age: user.Age, Bio: user.Bio, Location: user.Location, Lastname: user.LastName,Firstname: user.FirstName,Gender: user.Gender });
          } catch (error) {
            res.render("errorPage", { errorMessage: "Error" });
          }
        }
    }
  });

  router.post("/profile-picture/update", async (req, res) => {
    const decodedUser = verifyToken(res, req);
  
    if (decodedUser == null) {
      res.render("user", { isLoggedIn: false });
    } else {
      await db.collection("users").updateOne(
        { _id: new ObjectId(decodedUser._id) },
        {
          $set: {
            profileImageId: parseInt(req.body.profileImageId),
          },
        }
      );
      return res.redirect("/user");
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
  console.log("Req body:", req.body)

  if (decodedUser == null) {
    res.render("user", { isLoggedIn: false });
  } else {
   
    const user = await db.collection("users").findOne({username: req.body.userUsername});
    if (user && user._id.toString() !== req.body.userId){
      return res.status(400).json({message: "Username already taken"});
    }
    if (!req.body.userPassword) {
      return res.status(400).json({message: "Password is required"});
    }
    
     hashedPassword = await bcrypt.hash(req.body.userPassword, 10);
    console.log(req.body.userGender);
    await db.collection("users").updateMany(
      { _id: new ObjectId(req.body.userId) },
      {
        $set: {
          username: req.body.userUsername,
          password: hashedPassword,
          age: req.body.userAge,
          location: req.body.userLocation,
          "name.firstName": req.body.userFirstName,
          "name.lastName": req.body.userLastName,
          bio: req.body.userBio,
          gender: req.body.userGender,
        },
      }
     

    );
    decodedUser.username = req.body.userUsername;
    res.clearCookie("token");
    return res.redirect("/login");
  }
});

router.post('/delete', async (req, res) => {
  const userId = req.body.userId;
  await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
  res.clearCookie('token');
  res.sendStatus(200);
});

router.get("/events", async (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("userEvents", { isLoggedIn: false });
  } else {
    try {
      let user = await db
        .collection("users")
        .findOne({ username: decodedUser.username });

      let events = await db
        .collection("events")
        .find({
          _id: {
            $in: user.eventIds,
          },
        })
        .toArray();

      let userGroups = await db
        .collection("groups")
        .find({ _id: { $in: user.groupIds } })
        .toArray();

      res.render("userEvents", {
        isLoggedIn: true,
        events,
        user,
        userGroups,
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

router.post("/groups/:id/leave", async (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("groupEvents", { isLoggedIn: false });
  } else {
    try {
      // removes groupId from user.
      await db.collection("users").updateOne(
        { username: decodedUser.username },
        {
          $pull: {
            groupIds: {
              $in: [new ObjectId(req.params.id)],
            },
          },
        }
      );

      //removes userId from group
      await db.collection("groups").updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $pull: {
            userIds: {
              $in: [new ObjectId(decodedUser._id)],
            },
          },
        }
      );

      res.redirect("/");
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error, could not leave group" });
    }
  }
});

router.get("/groups/:groupId/events", async (req, res) => {
  const decodedUser = verifyToken(res, req);

  let groupEvents = [];

  if (decodedUser == null) {
    res.render("groupEvents", { isLoggedIn: false });
  } else {
    try {
      const user = await db
        .collection("users")
        .findOne({ username: decodedUser.username });

      // Checks if user is member of group related to events.
      if (!user.groupIds.toString().split(",").includes(req.params.groupId)) {
        res.render("errorPage", {
          errorMessage: "You are not a member of this group",
        });
        return;
      }

      const group = await db
        .collection("groups")
        .findOne({ _id: new ObjectId(req.params.groupId) });

      await db
        .collection("events")
        .find({ _id: { $in: group.eventIds } })
        .forEach((event) => {
          groupEvents.push(event);
        });

      res.render("groupEvents", {
        isLoggedIn: true,
        group,
        groupEvents,
        user,
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

router.post("/groups/:groupId/events/create", async (req, res) => {
  const decodedUser = verifyToken(res, req);

  let groupId;
  try {
    const dateListed = req.body.startDate.split("-");
    const timeListed = req.body.startTime.split(":");
    if (decodedUser != null) {
      if (req.params.groupId !== "undefined") {
        groupId = new ObjectId(req.params.groupId);
      } else {
        groupId = new ObjectId(req.body.groupId);
      }
      let createdEvent = {
        eventName: req.body.eventName,
        date: {
          year: parseInt(dateListed[0]),
          month: parseInt(dateListed[1]),
          day: parseInt(dateListed[2]),
          hour: parseInt(timeListed[0]),
          minute: parseInt(timeListed[1]),
        },
        description: req.body.description,
        location: { name: req.body.cityName, address: req.body.adressName },
        groupId: groupId,
        participantIds: [],
      };

      let insertedEventRes = await db
        .collection("events")
        .insertOne(createdEvent);

      //Add event to group

      await db
        .collection("groups")
        .updateOne(
          { _id: groupId },
          { $push: { eventIds: insertedEventRes.insertedId } }
        );
      if (req.params.groupId !== "undefined") {
        res.redirect(
          `/user/groups/${req.params.groupId}/events/${insertedEventRes.insertedId}`
        );
      } else {
        res.redirect(
          `/user/groups/${req.body.groupId}/events/${insertedEventRes.insertedId}`
        );
      }
    }
  } catch (error) {
    res.render("errorPage", { errorMessage: "Error, could not create event" });
  }
});

router.get("/groups/:groupId/events/:eventId", async (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("eventPage", { isLoggedIn: false });
  } else {
    try {
      const loggedInUser = await db
        .collection("users")
        .findOne({ username: decodedUser.username });

      // Checks if user is member of group related to event.

      if (
        !loggedInUser.groupIds
          .toString()
          .split(",")
          .includes(req.params.groupId)
      ) {
        res.render("errorPage", {
          errorMessage: "You are not a member of this group",
        });
        return;
      }

      const event = await db
        .collection("events")
        .findOne({ _id: new ObjectId(req.params.eventId) });

      const eventParticipants = await db
        .collection("users")
        .find({
          _id: { $in: event.participantIds },
        })
        .toArray();

      res.render("eventPage", {
        isLoggedIn: true,
        event,
        eventParticipants,
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
