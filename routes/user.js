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
    try {
      const user = await db
        .collection("users")
        .findOne({ username: decodedUser.username });

      res.render("user", { isLoggedIn: true, user });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
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

      groupUsers = await db
        .collection("users")
        .find({ _id: { $in: group.userIds } })
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
            authorId:
              req.body.authorId !== null
                ? new ObjectId(req.body.authorId)
                : null,
            createdAt: {
              year: req.body.createdAt.year,
              month: req.body.createdAt.month,
              day: req.body.createdAt.day,
              hour: req.body.createdAt.hour,
              minute: req.body.createdAt.minute,
            },
            isCustom: req.body.isCustom,
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

      const groupEvents = await db
        .collection("events")
        .find({ _id: { $in: group.eventIds } })
        .toArray();

      const groupSuggestedEvents = await db
        .collection("events")
        .find({ _id: { $in: group.suggestedEventIds } })
        .toArray();

      res.render("groupEvents", {
        isLoggedIn: true,
        group,
        groupEvents,
        groupSuggestedEvents,
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
      //Checks if event is created from inside group, or from user event page.
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
        isSuggested: false,
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
      const user = await db
        .collection("users")
        .findOne({ username: decodedUser.username });

      // Checks if user is member of group related to event.
      if (!user.groupIds.toString().split(",").includes(req.params.groupId)) {
        res.render("errorPage", {
          errorMessage: "You are not a member of this group",
        });
        return;
      }

      const group = await db
        .collection("groups")
        .findOne({ _id: new ObjectId(req.params.groupId) });

      const event = await db
        .collection("events")
        .findOne({ _id: new ObjectId(req.params.eventId) });

      const eventParticipants = await db
        .collection("users")
        .find({
          _id: { $in: event.participantIds },
        })
        .toArray();

      // checks if logged in user is partitioning in the event.
      const isUserParticipating =
        eventParticipants.filter(
          (participant) => participant.username == user.username
        ).length > 0
          ? true
          : false;

      res.render("eventPage", {
        isLoggedIn: true,
        event,
        eventParticipants,
        group,
        isUserParticipating,
        user,
      });
    } catch (error) {
      res.render("errorPage", { errorMessage: "Error" });
    }
  }
});

router.post("/groups/:groupId/events/:eventId/join", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  try {
    if (decodedUser != null) {
      await db.collection("events").updateOne(
        { _id: new ObjectId(req.params.eventId) },
        {
          $push: {
            participantIds: new ObjectId(decodedUser._id),
          },
        }
      );
      await db.collection("users").updateOne(
        { _id: new ObjectId(decodedUser._id) },
        {
          $push: {
            eventIds: new ObjectId(req.params.eventId),
          },
        }
      );

      res.redirect(
        `/user/groups/${req.params.groupId}/events/${req.params.eventId}`
      );
    }
  } catch (error) {
    res.render("errorPage", { errorMessage: "Error, could not create event" });
  }
});

router.post("/groups/:groupId/events/:eventId/leave", async (req, res) => {
  const decodedUser = verifyToken(res, req);
  try {
    if (decodedUser != null) {
      await db.collection("events").updateOne(
        { _id: new ObjectId(req.params.eventId) },
        {
          $pull: {
            participantIds: new ObjectId(decodedUser._id),
          },
        }
      );
      await db.collection("users").updateOne(
        { _id: new ObjectId(decodedUser._id) },
        {
          $pull: {
            eventIds: new ObjectId(req.params.eventId),
          },
        }
      );
      res.redirect(
        `/user/groups/${req.params.groupId}/events/${req.params.eventId}`
      );
    }
  } catch (error) {
    res.render("errorPage", { errorMessage: "Error, could not create event" });
  }
});

module.exports = router;
