const express = require("express");
const expessLayouts = require("express-ejs-layouts");

// Init app and middleware
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.set("layout", "./layouts/layout")
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(expessLayouts);


//Routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);



//Port
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
