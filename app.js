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

//Passport middleware
//The must be calling after the app.use(session({}))
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// DB config
const db = require("./config/database");

// Commect to mongoose
mongoose
  .connect(db.mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo DB connected...");
  })
  .catch(err => console.log(err));

// const MongoClient = require("mongodb").MongoClient;
// const uri =
//   "mongodb+srv://lalanke:12345@cluster0-sgfqa.azure.mongodb.net/vidjot-prod?retryWrites=true";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// //console.log(MongoClient);
// client.connect(err => {
//   const collection = client.db("vidjot-prod").collection("ideas");
//   //console.log(collection);
//   client.close();
// });

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

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started om port ${port}`);
});
