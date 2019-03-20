const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");

const app = express();

// Load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Passport config
require("./config/passport")(passport);

// Handle bars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Commect to mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev", { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo DB connected...");
  })
  .catch(err => console.log(err));

// Index Route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("INDEX", { title: title });
});

// About Route
app.get("/about", (req, res) => {
  res.render("ABOUT");
});

// Use Routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = 5000;

app.listen(port, () => {
  console.log(`Server started om port ${port}`);
});
