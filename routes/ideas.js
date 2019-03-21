const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");

// Load Idea model
require("./../models/Idea");
const Ideas = mongoose.model("ideas");

// Ideas Page
router.get("/", ensureAuthenticated, (req, res) => {
  Ideas.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(idea => {
      res.render("ideas/index", {
        idea: idea
      });
    });
});

// Add Ideas Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

// Edit Ideas Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Ideas.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        idea: idea
      });
    }
  });
});

// Process forms
router.post("/", ensureAuthenticated, (req, res) => {
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
      details: req.body.details,
      user: req.user.id
    };

    new Ideas(newUser).save().then(idea => {
      req.flash("success_msg", "Video Idea Added");
      res.redirect("/ideas");
    });
  }
});

// Edit form process
router.put("/:id", ensureAuthenticated, (req, res) => {
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
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Ideas.deleteOne({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Video Idea Removed");
    res.redirect("/ideas");
  });
});

module.exports = router;
