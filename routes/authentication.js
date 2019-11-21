"use strict";

require("dotenv").config();
const { Router } = require("express");
const router = Router();
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post(
  "/signup",
  passport.authenticate("signup", {
    successRedirect: "/home",
    failureRedirect: "/signup"
  })
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/login"
  })
);

router.get("/home", (req, res) => {
  res.render("home", { API_KEY: process.env.API_KEY });
});

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
