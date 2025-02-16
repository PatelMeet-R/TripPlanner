const { Trip } = require("../Model/Trip");

module.exports.index = async (req, res) => {
  try {
    let allTrips = await Trip.find({});
    res.render("trips/index.ejs", { allTrips });
  } catch (err) {
    console.log("get route for index", err);
  }
};
module.exports.renderTripForm = async (req, res) => {
  try {
    res.render("trips/new.ejs");
  } catch (err) {
    console.log("error et rendering new EJS", err);
  }
};
module.exports.createTrip = async (req, res) => {
  try {
    let tripData = req.body.trip;
    tripData.TripCreator = req.user.id;
    
    const tripDetails = await Trip.insertOne(tripData);
    req.flash("success", "The trip has been successfully created.");
    res.redirect("/trips");
  } catch (error) {
    req.flash("error", "Something went Wrong create new Trip Again ");
    res.redirect("/trips/new");
    console.log("fail to save the trip", error);
  }
};
module.exports.showTrip = async (req, res) => {
  try {
    let id = req.params.id;
    let trip = await Trip.findById(id)
      .populate("activityDetails")
      .populate({ path: "TripCreator", select: "-email -password" });
    if (!trip) {
      req.flash("error", "Trip not found");
      return res.redirect("/trips");
    }
    res.render("trips/show.ejs", { trip });
  } catch (error) {
    console.log("fetching from DB failed", error);
  }
};
module.exports.renderEditTrip = async (req, res) => {
  let { id } = req.params;
  let trip = await Trip.findById(id);
  if (!trip) {
    req.flash("error", "The trip could not be found for editing.");
    return res.redirect("/trips");
  }
  res.render("trips/edit.ejs", { trip });
};
module.exports.editTrip = async (req, res) => {
  try {
    let { id } = req.params;
    let tripData = req.body.trip;
    const tripUpdate = await Trip.findByIdAndUpdate(
      id,
      { ...tripData },
      { runValidators: true, new: true }
    );
    if (!tripUpdate) {
      req.flash("error", "The trip could not be found for editing.");
      return res.redirect(`/trips`);
    }
    req.flash("success", "The trip has been successfully edited.");
    res.redirect("/trips");
  } catch (error) {
    console.log("this error occurs at edit route", error);
  }
};
module.exports.destroyTrip = async (req, res) => {
  try {
    let { id } = req.params;
    await Trip.findByIdAndDelete(id);
    req.flash("success", "Your trip has been successfully deleted.");
    res.redirect("/trips");
  } catch (error) {
    req.flash("error", "Something went Wrong");
    res.redirect("/trips");
    console.log("this error occurs at delete route", error);
  }
};
