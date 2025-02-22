const jwt = require("jsonwebtoken");
const { Trip } = require("./Model/Trip");
const { Activity } = require("./Model/activity");
const { tripSchema } = require("./SchemaValidation");

module.exports.isAuthenticate = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    req.session.saveRedirect = req.originalUrl || req.path;
    req.flash("error", "Please log in to make changes to this page.");
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    req.flash("error", "Session expired. Please log in again.");
    return res.redirect("/login");
  }
};

module.exports.isloggin = (req, res, next) => {
  const token = req.cookies.authToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.currUser = req.user;
    } catch (err) {
      console.log("JWT verification failed:", err);
      req.user = null;
      res.locals.currUser = null;
    }
  } else {
    req.user = null;
    res.locals.currUser = null;
  }

  next();
};
module.exports.isValidateTripCreator = async (req, res, next) => {
  let { id } = req.params;
  let trip = await Trip.findById(id);

  if (!trip.TripCreator.equals(res.locals.currUser.id)) {
    req.flash("error", "Only the trip organizer can make changes.");
    return res.redirect(`/trips`);
  }
  next();
};
module.exports.isValidateActivityCreator = async (req, res, next) => {
  let { id, actId } = req.params;
  let activity = await Activity.findById(actId);

  if (!activity.ActivityCreator.equals(res.locals.currUser.id)) {
    req.flash(
      "error",
      "You can't delete the activity because you're not its creator."
    );
    return res.redirect(`/trips/${id}`);
  }
  next();
};

module.exports.validateTripData = (req, res, next) => {
  try {
    tripSchema.parse(req.body.trip);
    next(); // Proceed if validation passes
  } catch (error) {
    // If validation fails, handle the error
    const errMsg = error.errors.map((e) => e.message).join(", ");
    req.flash("error", `Validation failed: ${errMsg}`);
    res.redirect("back"); // Redirect back to the form if validation fails
  }
};
