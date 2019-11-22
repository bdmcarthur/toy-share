"use strict";

const { Router } = require("express");
const router = Router();

const toys = require("../models/toys");
const uploadCloud = require("../configurations/cloudinary.js");
const routeGuardMiddleware = require("../controllers/route-guard-middleware");

router.get("/toys", (req, res, next) => {
  toys.find({}, (error, toys) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ toys: toys });
    }
  });
});
let today = new Date();

router.get("/toys/:term", (req, res, next) => {
  let term = req.params;
  console.log(term);
});

router.get("/add", routeGuardMiddleware, (req, res, next) => {
  res.render("add");
});

router.post("/addtoy", uploadCloud.single("file"), (req, res, next) => {
  let name = req.body.name;
  let location = req.body.location;
  let category = req.body.category;
  let description = req.body.description;
  let image = req.file.url;
  toys
    .create({
      name: name,
      time: today.getHours() + ":" + today.getMinutes(),
      _addedBy: req.user._id,
      location: location,
      category: category,
      description: description,
      image: req.file.url
    })
    .then(toy => {
      res.redirect("/home");
      console.log("The toy is saved and its value is: ", toy);
    })
    .catch(err => {
      console.log("An error happened:", err);
    });
});

router.get("/edit/:id", routeGuardMiddleware, (req, res, next) => {
  toys
    .findOne({ _id: req.params.id })
    .then(toy => {
      res.render("edit", { toy });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/edit/:id", routeGuardMiddleware, (req, res, next) => {
  const name = req.body.name;
  const category = req.body.category;
  const description = req.body.description;
  toys
    .update({ _id: req.params.id }, { $set: { name, category, description } })
    .then(toy => {
      res.redirect("/profile/" + req.user._id);
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/delete/:id", routeGuardMiddleware, (req, res, next) => {
  toys
    .deleteOne({ _id: req.params.id })
    .then(toy => {
      res.redirect("/profile/" + req.user._id);
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/toyDetail/:id", (req, res, next) => {
  const id = req.params.id;
  toys
    .findById(id)
    .populate("_addedBy")
    .populate({
      path: "reviews._postedBy"
    })
    .then(toy => {
      res.render("toy-detail", { toy });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/add-comment/:id", routeGuardMiddleware, (req, res, next) => {
  const id = req.params.id;
  const newReview = {
    title: req.body.title,
    comment: req.body.comment,
    _postedBy: req.user._id
  };

  toys
    .findByIdAndUpdate(id, {
      $push: { reviews: newReview }
    })
    .then(toy => {
      res.redirect("/toyDetail/" + toy._id);
    })
    .catch(error => {
      console.log(error);
    });
});
module.exports = router;
