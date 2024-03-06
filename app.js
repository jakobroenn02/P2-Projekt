const express = require("express");
const expessLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const { cookieJwtAuth } = require("./middleware/cookieJwtAuth");
// Init app and middleware
const app = express();
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


//Port
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
