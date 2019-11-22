"use strict";

const mongoose = require("mongoose");
const Object = mongoose.Schema.Types.ObjectId;
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  _favorites: [
    {
      type: Object,
      ref: "Toy"
    }
  ]
});

const signInStatic = require("./user-login");
const signUpStatic = require("./user-signup");

userSchema.statics.signIn = signInStatic;
userSchema.statics.signUp = signUpStatic;

userSchema.statics.findByEmail = function(email, name) {
  const Model = this;
  return Model.findOne({ email })
    .then(user => {
      const data = {
        user: user,
        name: name
      };
      return Promise.resolve(data);
    })
    .catch(error => {
      return Promise.reject(error);
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
