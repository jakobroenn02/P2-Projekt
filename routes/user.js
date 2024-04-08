const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/cookiesUtils");
const {
  getLoggedInUser,
  getLocations,
  isUsernameTaken,
  updateUserInfo,
  getUserEvents,
  getUserGroups,
  getGroup,
  getGroupUsers,
  isUserInGroup,
} = require("../utils/dbUtils");

//connect to db
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

//routes
router.get("/", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("user", { isLoggedIn: false, hasTypeWrong: false });
    } else {
      const user = await getLoggedInUser(token);

      const locations = await getLocations();

      res.render("user", {
        isLoggedIn: true,
        hasTypeWrong: false,
        user,
        location: locations,
      });
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/profile-picture/update", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("user", { isLoggedIn: false });
    } else {
      await db.collection("users").updateOne(
        { _id: new ObjectId(token._id) },
        {
          $set: {
            profileImageId: parseInt(req.body.profileImageId),
          },
        }
      );
      return res.redirect("/user");
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/bio/update", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("user", { isLoggedIn: false });
    } else {
      await db.collection("users").updateMany(
        { _id: new ObjectId(token._id) },
        {
          $set: {
            bio: req.body.userBio,
          },
        }
      );
      res.redirect("/user");
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/info/update", async (req, res) => {
  try {
    const token = verifyToken(res, req);
    if (token == null) {
      res.render("user", { isLoggedIn: false });
    } else {
      //Checks if user changed to username that is already taken.
      if (
        req.body.userUsername !== token.username &&
        !(await isUsernameTaken(req.body.username))
      ) {
        await updateUserInfo(
          token._id,
          req.body.userUsername,
          req.body.userAge,
          req.body.userLocation,
          req.body.userFirstName,
          req.body.userLastName,
          null,
          req.body.userGender
        );
        return res.redirect("/user");
      } else {
        // if you try to change username to one that is already taken
        const user = await getLoggedInUser(token);
        res.render("user", { isLoggedIn: true, hasTypeWrong: true, user });
      }
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.get("/events", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("userEvents", { isLoggedIn: false });
    } else {
      let user = await getLoggedInUser(token);
      let events = await getUserEvents(token._id);
      let userGroups = await getUserGroups(token._id);

      res.render("userEvents", {
        isLoggedIn: true,
        events,
        user,
        userGroups,
      });
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.get("/groups", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("groups", { isLoggedIn: false });
    } else {
      const user = await getLoggedInUser(token);
      const groups = await getUserGroups(token._id);

      res.render("groups", { isLoggedIn: true, groups, user });
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.get("/groups/:groupId", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("group", { isLoggedIn: false });
    } else {
      const user = await getLoggedInUser(token);
      const group = await getGroup(req.params.groupId);
      const groupUsers = await getGroupUsers(req.params.groupId);

      //Checks if user is member of group
      if (await isUserInGroup(token._id, req.params.groupId)) {
        res.render("group", {
          isLoggedIn: true,
          groupUsers,
          group,
          user,
        });
      } else {
        res.render("errorPage", {
          errorMessage: "Access denied",
          isLoggedIn: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/groups/:id", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
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
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/groups/:id/leave", async (req, res) => {
  const decodedUser = verifyToken(res, req);

  if (decodedUser == null) {
    res.render("groupEvents", { isLoggedIn: false });
  } else {
    try {
      // Find all events in the group that the user is participating in
      const events = await db
        .collection("events")
        .find({
          groupId: new ObjectId(req.params.id),
          participantIds: new ObjectId(decodedUser._id),
        })
        .toArray();
      const eventIds = events.map((event) => event._id);
      console.log(eventIds);
      // removes groupId and eventIds from user.
      await db.collection("users").updateOne(
        { _id: new ObjectId(decodedUser._id) },
        {
          $pull: {
            groupIds: {
              $in: [new ObjectId(req.params.id)],
            },
            eventIds: {
              $in: eventIds,
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

      // removes userId from events in the group
      await db.collection("events").updateMany(
        { _id: { $in: eventIds } },
        {
          $pull: {
            participantIds: {
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
        user,
        group,
        isUserParticipating,
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
