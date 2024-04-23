const express = require("express");
const expessLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const { cookieJwtAuth } = require("./middleware/cookieJwtAuth");
const socketIO = require("socket.io");
const http = require("http");
const { generateMessage } = require("./utils/socketUtils");

// Init app and middleware
const app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.set("view engine", "ejs");
app.set("views", "views");
app.set("layout", "./layouts/layout");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(expessLayouts);
app.use(cookieParser());

//Routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const loginRouter = require("./routes/login");
app.use("/login", loginRouter);

const registerRouter = require("./routes/register");
app.use("/register", registerRouter);

const discoverRouter = require("./routes/discover");
app.use("/discover", discoverRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const groupsRouter = require("./routes/users");
app.use("/users", groupsRouter);

// Route for errors
app.use((req, res, next) => {
  res.status(404).render("404", { req: req });
});

//Socket io
io.on("connection", (socket) => {
  socket.on("join", (groupId, cb) => {
    socket.join(groupId);
  });

  socket.on("createMessage", (roomId, message, cb) => {
    socket.broadcast
      .to(roomId)
      .emit(
        "displayMessage",
        generateMessage(
          message.authorName,
          message.messageText,
          message.authorId,
          message.isCustom
        )
      );
    cb(message);
  });

  socket.on("disconnect", () => {});
});

server.listen(8080, async () => {
  console.log("Server is running on port http://localhost:3000");
});
