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
  addMessageToGroup,
  removeUserFromGroup,
  removeGroupFromUser,
  getGroupEvents,
  getGroupSuggestedEvents,
  getInterests,
  setUserInterests,
  getEventParticipants,
  isUserInEvent,
  getEvent,
  addUserToEvent,
  addEventToUser,
  removeUserFromEvent,
  removeEventFromUser,
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

router.post("/info/update", async (req, res) => {
  try {
    let hashedPassword;
    const token = verifyToken(res, req);
    if (token == null) {
      res.render("user", { isLoggedIn: false });
    } else {
      //Checks if user changed to username that is already taken.
      if (
        req.body.userUsername !== token.username &&
        !(await isUsernameTaken(req.body.username))
      ) {
        //Checks if user want to change passowrd or not
        if (req.body.hasOwnProperty("userPassword")) {
          if (req.body.userPassword != "") {
            console.log(req.body.userPassword);
            hashedPassword = await bcrypt.hash(req.body.userPassword, 10);
          }
        }

        await updateUserInfo(
          token._id,
          req.body.userUsername,
          req.body.userAge,
          req.body.userLocation,
          req.body.userFirstName,
          req.body.userLastName,
          req.body.userBio,
          req.body.userGender,
          hashedPassword == undefined ? null : hashedPassword
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

router.post("/delete", async (req, res) => {
  try {
    await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.body.userId) });
    res.clearCookie("token");
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

router.post("/groups/:groupId", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("group", { isLoggedIn: false });
    } else {
      await addMessageToGroup(
        {
          messageText: req.body.messageText,
          authorName: req.body.authorName,
          authorId:
            req.body.authorId !== null ? new ObjectId(req.body.authorId) : null,
          createdAt: {
            year: req.body.createdAt.year,
            month: req.body.createdAt.month,
            day: req.body.createdAt.day,
            hour: req.body.createdAt.hour,
            minute: req.body.createdAt.minute,
          },
          isCustom: req.body.isCustom,
        },
        req.params.groupId
      );
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/groups/:groupId/leave", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("groupEvents", { isLoggedIn: false });
    } else {
      //TODO Rodet
      //Finds all events in the group, that the user is participating in.
      const userGroupEvents = await db
        .collection("events")
        .find({
          groupId: new ObjectId(req.params.groupId),
          participantIds: new ObjectId(token._id),
        })
        .toArray();
      const userGroupEventIds = userGroupEvents.map((event) => event._id);

      // removes all eventId from user, og which he was participating in, in that group..
      await db.collection("users").updateOne(
        { _id: new ObjectId(token._id) },
        {
          $pull: {
            eventIds: {
              $in: userGroupEventIds,
            },
          },
        }
      );

      // removes userId from all events in the group.
      await db.collection("events").updateMany(
        { _id: { $in: userGroupEventIds } },
        {
          $pull: {
            participantIds: {
              $in: [new ObjectId(token._id)],
            },
          },
        }
      );

      await removeUserFromGroup(token._id, req.params.groupId);
      await removeGroupFromUser(req.params.groupId, token._id);

      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.get("/groups/:groupId/events", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("groupEvents", { isLoggedIn: false });
    } else {
      const user = await getLoggedInUser(token);

      // Checks if user is member of group related to events.
      if (!(await isUserInGroup(token._id, req.params.groupId))) {
        res.render("errorPage", {
          errorMessage: "You are not a member of this group",
        });
        return;
      }

      const group = await getGroup(req.params.groupId);
      const groupEvents = await getGroupEvents(req.params.groupId);
      const groupSuggestedEvents = await getGroupSuggestedEvents(
        req.params.groupId
      );

      res.render("groupEvents", {
        isLoggedIn: true,
        group,
        groupEvents,
        groupSuggestedEvents,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.get("/interests", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("interests", { isLoggedIn: false });
    } else {
      const interests = await getInterests();
      let user = await getLoggedInUser(token);

      res.render("interests", { isLoggedIn: true, interests, user });
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/interests", async (req, res) => {
  try {
    const token = verifyToken(res, req);
    const selectedInterests = Object.values(req.body);

    if (token != null) {
      await setUserInterests(token._id, selectedInterests);

      res.redirect("/user");
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/groups/:groupId/events/create", async (req, res) => {
  try {
    const token = verifyToken(res, req);
    let groupId;

    const dateListed = req.body.startDate.split("-");
    const timeListed = req.body.startTime.split(":");

    if (token != null) {
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
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.get("/groups/:groupId/events/:eventId", async (req, res) => {
  try {
    const token = verifyToken(res, req);

    if (token == null) {
      res.render("eventPage", { isLoggedIn: false });
    } else {
      const user = await getLoggedInUser(token);

      // Checks if user is member of group related to event.
      if (!isUserInGroup(token._id, req.params.groupId)) {
        res.render("errorPage", {
          errorMessage: "You are not a member of this group",
        });
        return;
      }
      const group = await getGroup(req.params.groupId);
      const event = await getEvent(req.params.eventId);
      const eventParticipants = await getEventParticipants(req.params.eventId);
      const isUserParticipating = await isUserInEvent(
        token._id,
        req.params.eventId
      );

      res.render("eventPage", {
        isLoggedIn: true,
        event,
        eventParticipants,
        user,
        group,
        isUserParticipating,
      });
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/groups/:groupId/events/:eventId/join", async (req, res) => {
  try {
    const token = verifyToken(res, req);
    if (token != null) {
      await addUserToEvent(token._id, req.params.eventId);
      await addEventToUser(req.params.eventId, token._id);

      res.redirect(
        `/user/groups/${req.params.groupId}/events/${req.params.eventId}`
      );
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

router.post("/groups/:groupId/events/:eventId/leave", async (req, res) => {
  try {
    const token = verifyToken(res, req);
    if (token != null) {
      await removeUserFromEvent(token._id, req.params.eventId);
      await removeEventFromUser(req.params.eventId, token._id);

      res.redirect(
        `/user/groups/${req.params.groupId}/events/${req.params.eventId}`
      );
    }
  } catch (error) {
    console.log(error);
    res.render("errorPage", { errorMessage: error });
  }
});

module.exports = router;
