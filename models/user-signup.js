"use strict";

const bcrypt = require("bcrypt");

// Create a sign in static that is going to abstact the authentication functionality
module.exports = function(email, password, name) {
  console.log(email, password, name);
  const Model = this;
  return Model.findByEmail(email, name)
    .then(user => {
      // name = user;
      console.log("help", user);
      console.log("name", name);
      if (user.user) {
        throw new Error("USER_ALREADY_EXISTS");
      } else {
        console.log("help", user);
        return bcrypt.hash(password, 10);
      }
    })
    .then(hash => {
      return Model.create({
        email,
        passwordHash: hash,
        name: name
      });
    })
    .then(user => {
      return Promise.resolve(user);
    })
    .catch(error => {
      console.log(error);
      return Promise.reject(
        new Error("There was an error in the sign up process.")
      );
    });
};
