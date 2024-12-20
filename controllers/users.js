const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
  //res.send(req.body);
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    //console.log(registeredUser);
    req.login(registeredUser, function (err) {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back!");
  //res.redirect("/campgrounds");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
