const express = require("express");
const expessLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const { cookieJwtAuth } = require("./middleware/cookieJwtAuth");
const socketIO = require("socket.io");
const http = require("http");

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

// Route for errors
app.use((req, res, next) => {
  res.status(404).render("404", { req: req });
});

//Socket io
io.on("connection", (socket) => {
  socket.on("createMessage", (message, cb) => {
    io.emit(
      "displayMessage",
      generateMessage(message.authorFirstName, message.messageText)
    );
    cb(message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server.");
  });
});

//Port
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

function generateMessage(authorFirstName, messageText) {
  return {
    authorFirstName: authorFirstName,
    messageText: messageText,
    createdAt: new Date().getTime(),
  };
}
