const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const crypto = require("node:crypto");
const nodemailer = require("nodemailer");

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

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
    role: userInDatabase.role,
    sessionVersion: userInDatabase.sessionVersion
  };

  res.redirect("/");
});


router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password.ejs", { message: null });
});

router.post("/forgot-password", async (req, res, next) => {
  const email = typeof req.body.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";

  const message =
    "If an account exists for that email, we'll send a reset link.";

  try {
    const user = email ? await User.findOne({ email }) : null;

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const link = new URL("/auth/reset-password", process.env.APP_BASE_URL);
      link.searchParams.set("token", token);

      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const now = Date.now();
      const result = await User.updateOne({
        _id: user._id,
        $or: [
          { resetPasswordExpiresAt: { $exists: false } },
          { resetPasswordExpiresAt: { $lte: new Date(now + 29 * 60 * 1000) } }
        ]
      }, {
        $set: {
          resetPasswordTokenHash: tokenHash,
          resetPasswordExpiresAt: new Date(now + 30 * 60 * 1000)
        }
      });
      if (result.matchedCount === 0) {
        return res.render("auth/forgot-password.ejs", { message });
      }

      try {
        await transporter.sendMail({
          from: process.env.MAIL_FROM,
          to: user.email,
          subject: "Reset your Bluebell password",
          text: `This link expires in 30 minutes: ${link.toString()}`
        });
      } catch {
        await User.updateOne({ _id: user._id, resetPasswordTokenHash: tokenHash }, {
          $unset: { resetPasswordTokenHash: "", resetPasswordExpiresAt: "" }
        });
        console.error("Password reset email could not be sent.");
      }
    }

    res.render("auth/forgot-password.ejs", { message });
  } catch (error) {
    next(error);
  }
});

router.use("/reset-password", (req, res, next) => {
  res.set("Referrer-Policy", "no-referrer");
  res.set("Cache-Control", "no-store");
  next();
});

function findActiveReset(token) {
  return {
    resetPasswordTokenHash: crypto.createHash("sha256").update(token).digest("hex"),
    resetPasswordExpiresAt: { $gt: new Date() }
  };
}

function isResetToken(token) {
  return typeof token === "string" && /^[a-f0-9]{64}$/.test(token);
}

router.get("/reset-password", async (req, res) => {
  const token = req.query.token;
  if (!isResetToken(token) || !await User.exists(findActiveReset(token))) {
    return res.status(400).render("auth/reset-password.ejs", { token: null, error: "This reset link is invalid or expired." });
  }
  res.render("auth/reset-password.ejs", { token, error: null });
});

router.post("/reset-password", async (req, res) => {
  const { token, password, confirmPassword } = req.body || {};
  const invalidLink = () => res.status(400).render("auth/reset-password.ejs", {
    token: null, error: "This reset link is invalid or expired."
  });
  if (!isResetToken(token) || !await User.exists(findActiveReset(token))) {
    return invalidLink();
  }

  if (typeof password !== "string" || password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72 || password !== confirmPassword) {
    return res.status(400).render("auth/reset-password.ejs", {
      token, error: "Use at least 8 characters and at most 72 bytes. Both passwords must match."
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await User.updateOne(findActiveReset(token), {
    $set: { password: passwordHash },
    $unset: { resetPasswordTokenHash: "", resetPasswordExpiresAt: "" },
    $inc: { sessionVersion: 1 }
  });
  if (result.matchedCount === 0) return invalidLink();

  delete req.session.user;
  res.redirect("/auth/sign-in");
});


module.exports = router;
