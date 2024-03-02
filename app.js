const express = require("express");

// Init app and middleware
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

//Routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

//Port
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
