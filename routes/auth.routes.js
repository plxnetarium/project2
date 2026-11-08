const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");


// Sign up routes
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", body("email").isString().bail().trim().isEmail()
  .withMessage("Enter a valid email address."), async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).send("Enter a valid email address.");
  }

  const email = (req.body.email || '').trim().toLowerCase();
  const userInDatabase = await User.findOne({ email });
  if (userInDatabase) {
    return res.send("Email already registered.");
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and Confirm Password must match");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  await User.create({
    name: req.body.name,
    email,
    password: hashedPassword
  });
  res.redirect("/auth/sign-in");
});



// Sign in routes
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});



router.post("/sign-in", async (req, res) => {
  // First, get the user from the database
  const email = (req.body.email || "").trim().toLowerCase();
  const userInDatabase = await User.findOne({ email });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }

  // There is a user! Time to test their password with bcrypt
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }

  // There is a user AND they had the correct password. Time to make a session!
  // Avoid storing the password, even in hashed format, in the session
  // If there is other data you want to save to `req.session.user`, do so here!
  req.session.user = {
    _id: userInDatabase._id,
    name: userInDatabase.name,
    role: userInDatabase.role
  };

  res.redirect("/");
});


router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});





module.exports = router;
