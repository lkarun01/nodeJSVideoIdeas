const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

// Handle bars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Load Idea model
require("./models/Idea");
const Ideas = mongoose.model("ideas");

// Index Route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("INDEX", { title: title });
});

// About Route
app.get("/about", (req, res) => {
  res.render("ABOUT");
});

// Ideas Page
app.get("/ideas", (req, res) => {
  Ideas.find({})
    .sort({ date: "desc" })
    .then(idea => {
      res.render("ideas/index", {
        idea: idea
      });
    });
});

// Add Ideas Form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

// Edit Ideas Form
app.get("/ideas/edit/:id", (req, res) => {
  Ideas.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", {
      idea: idea
    });
  });
});

// Process forms
app.post("/ideas", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }

  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors,
      title: req.body.title,
      details: req.body.details
    });
    //console.log(errors);
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };

    new Ideas(newUser).save().then(idea => {
      req.flash("success_msg", "Video Idea Added");
      res.redirect("/ideas");
    });
  }
});

// Edit form process
app.put("/ideas/:id", (req, res) => {
  Ideas.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then(idea => {
      req.flash("success_msg", "Video Idea Updated");
      res.redirect("/ideas");
    });
  });
});

// Delete form process
app.delete("/ideas/:id", (req, res) => {
  Ideas.deleteOne({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Video Idea Removed");
    res.redirect("/ideas");
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started om port ${port}`);
});
