const { Trip } = require("../Model/Trip");
const { wrapAsync } = require("../Utils/wrapAsync");
const ExpressError = require("../Utils/Error/ExpressError");

// Use wrapAsync for all async route handlers
module.exports.index = wrapAsync(async (req, res) => {
  let allTrips = await Trip.find({});
  if (!allTrips || allTrips.length === 0) {
    throw new ExpressError(404, "No trips found.");
  }
  res.render("trips/index.ejs", { allTrips });
});

module.exports.renderTripForm = wrapAsync(async (req, res) => {
  res.locals.showSearch = false;
  res.render("trips/new.ejs");
});

module.exports.createTrip = wrapAsync(async (req, res) => {
  let tripData = req.body.trip;
  tripData.TripCreator = req.user.id;

  const tripDetails = await Trip.create(tripData);
  if (!tripDetails) {
    throw new ExpressError(400, "Failed to create a new trip.");
  }

  req.flash("success", "The trip has been successfully created.");
  res.redirect("/trips");
});

module.exports.showTrip = wrapAsync(async (req, res) => {
  let id = req.params.id;
  let trip = await Trip.findById(id)
    .populate("activityDetails")
    .populate({ path: "TripCreator", select: "-email -password" });

  if (!trip) {
    throw new ExpressError(404, "Trip not found.");
  }

  res.render("trips/show.ejs", { trip });
});

module.exports.renderEditTrip = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let trip = await Trip.findById(id);

  if (!trip) {
    throw new ExpressError(404, "The trip could not be found for editing.");
  }

  res.render("trips/edit.ejs", { trip });
});

module.exports.editTrip = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let tripData = req.body.trip;

  const tripUpdate = await Trip.findByIdAndUpdate(
    id,
    { ...tripData },
    { runValidators: true, new: true }
  );

  if (!tripUpdate) {
    throw new ExpressError(404, "The trip could not be found for editing.");
  }

  req.flash("success", "The trip has been successfully edited.");
  res.redirect("/trips");
});

module.exports.destroyTrip = wrapAsync(async (req, res) => {
  let { id } = req.params;

  const trip = await Trip.findByIdAndDelete(id);
  if (!trip) {
    throw new ExpressError(404, "The trip could not be found for deletion.");
  }

  req.flash("success", "Your trip has been successfully deleted.");
  res.redirect("/trips");
});
module.exports.searchRequest = wrapAsync(async (req, res) => {
  let input = req.query.q;
  let query = input ? input.trim() : "";

  if (query === "") {
    req.flash("error", "Please enter a search query!");
    return res.status(404).redirect("/trips");
  }

  let searchQuery = new RegExp(query, "i");

  const searchList = await Trip.find({
    $or: [
      { title: searchQuery },
      { initialpoint: searchQuery },
      { "destination.country": searchQuery },
      { "destination.location": searchQuery },
      { description: searchQuery },
      { status: searchQuery },
    ],
  });
  if (searchList.length === 0) {
    req.flash("error", "No trips found based on your search");
    return res.redirect("/trips");
  }

  return res.status(200).render("trips/index.ejs", {
    allTrips: searchList,
    input,
  });
});
