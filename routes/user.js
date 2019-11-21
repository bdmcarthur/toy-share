"use strict";

const { Router } = require("express");
const router = Router();

const toys = require("../models/toys");
const User = require("../models/user");

router.get("/profile/:id", (req, res, next) => {
  const favoritesList = req.user._favorites;
  Promise.all([
    User.findById(req.user._id).populate("_favorites"),
    toys.find({ addedBy: req.user.email })
  ])
    .then(([user, toys]) => {
      const data = {
        toys: toys,
        favorites: user._favorites
      };
      res.render("profile", data);
    })
    .catch(error => {
      console.log("Got an error updating", error);
    });
});

router.post("/addFavorite/:id", (req, res, next) => {
  console.log("new", req.params.id);
  User.findByIdAndUpdate(req.user._id, {
    $push: { _favorites: req.params.id }
  })
    .then(user => {
      console.log("this is", req.originalUrl);
      res.redirect("/profile/" + req.user._id);
      // res.redirect('/' + req.originalUrl);
    })
    .catch(error => {
      console.log("Got an error updating");
    });
});

module.exports = router;
