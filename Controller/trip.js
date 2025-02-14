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
  let tripData = req.body.trip;
  const tripDetails = await Trip.insertOne(tripData);
  //   req.flash("success", "New Trip Created");
  res.redirect("/trips");
};
module.exports.showTrip = async (req, res) => {
  let id = req.params.id;
  let trip = await Trip.findById(id).populate("activityDetails");
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }
  res.render("trips/show.ejs", { trip });
};
module.exports.renderEditTrip = async (req, res) => {
  let { id } = req.params;
  let trip = await Trip.findById(id);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
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
      return res.status(404).json({ message: "Trip not found" });
    }
    res.redirect("/trips");
  } catch (error) {
    console.log("this error occure at edit route", error);
  }
};
module.exports.destroyTrip = async (req, res) => {
  try {
    let { id } = req.params;
    await Trip.findByIdAndDelete(id);
    res.redirect("/trips");
  } catch (error) {
    console.log("this error occure at delete route", error);
  }
};
