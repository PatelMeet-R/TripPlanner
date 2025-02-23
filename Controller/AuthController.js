const User = require("../Model/User");

module.exports.renderSignUPForm = (req, res) => {
  res.locals.showSearch = false; // Do not show the search bar
  res.render("User/signup.ejs");
};
module.exports.signUpUser = async (req, res) => {
  const data = req.body.user;
  const { username, email } = data;
  try {
    const user = await User.findOne({ username, email });
    if (user) {
      req.flash("error", "This account already exists");
      return res.redirect("/signup");
    } else {
      const newUser = await User.create(data);

      const token = await newUser.getJWT();
      if (!token) {
        throw new Error("Token generation failed.");
      }
      await newUser.save();
      res.cookie("authToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
      res.redirect("/trips");
    }
  } catch (error) {
    console.log(error);
    await User.deleteOne({ _id: newUser._id });
    req.flash("error", "Something went wrong. Please SignUp again.");
    return res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.locals.showSearch = false; // Do not show the search bar
  res.render("User/login.ejs");
};
module.exports.loginRequest = async (req, res) => {
  const { username, password } = req.body.user;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash("error", "Username not found. Please try again.");
      return res.redirect("/login");
    }
    const isMatch = await user.isPassValid(password);
    if (!isMatch) {
      req.flash("error", "Invalid password. Please try again.");
      return res.redirect("/login");
    }

    const token = await user.getJWT();
    res.cookie("authToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000),
      maxAge: 60 * 60 * 1000,
    });
    const redirectTo = req.session.saveRedirect || "/trips";
    delete req.session.saveRedirect;
    req.flash("success", "You have successfully logged in!");

    return res.redirect(redirectTo);
  } catch (error) {
    req.flash("error", "An error occurred while logging in. Please try again.");
    return res.redirect("/login");
  }
};
module.exports.logOutRequest = (req, res) => {
  res.cookie("authToken", null, {
    expires: new Date(Date.now()),
  });
  res.clearCookie("authToken");
  if (!req.cookies.authToken) {
    console.log("Cookie 'authToken' has been cleared.");
  }
  req.flash("success", "You have been successfully logged out.");
  res.redirect("/trips");
};
