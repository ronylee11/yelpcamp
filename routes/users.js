const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const user = require("../controllers/users");

router
  .route("/register")
  .get(user.renderRegister)
  .post(catchAsync(user.registerUser));

router
  .route("/login")
  .get(user.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    user.loginUser
  );

router.get("/logout", isLoggedIn, user.logoutUser);

module.exports = router;
