const { Trip } = require("../Model/Trip");
const { Activity } = require("../Model/activity");

module.exports.createActivity = async (req, res) => {
  try {
    let { id } = req.params;
    let trip = await Trip.findById(id);
    if (!trip) {
      req.flash("error", "The requested trip could not be found.");

      return res.redirect("/trips");
    }
    let data = req.body.activity;
    data.ActivityCreator = req.user.id;
    let activity = new Activity(data);
    trip.activityDetails.push(activity);
    await activity.save();
    await trip.save();
    req.flash(
      "success",
      `Successfully created a new activity for the trip: ${trip.title}.
      Your activity, ${activity.actName}, has been added.`
    );
    res.redirect(`/trips/${id}`);
  } catch (error) {
    console.log("this error occure at activities add", error);
  }
};

module.exports.destroyActivity = async (req, res) => {
  try {
    let { id, actId } = req.params;
    let trip = await Trip.findByIdAndUpdate(id, {
      $pull: { activityDetails: actId },
    });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    await Activity.findByIdAndDelete(actId);
    req.flash("success", "The activity was successfully deleted.");
    res.redirect(`/trips/${id}`);
  } catch (error) {
    console.log("this error occure at activities deletaions", error);
  }
};

module.exports.editActivity = async (req, res) => {
  try {
    let { id, actId } = req.params;
    await Activity.findByIdAndUpdate(actId, req.body.activity);
    req.flash("success", "The trip has been successfully updated.");
    res.redirect(`/trips/${id}`);
  } catch (error) {
    console.log("this error occure at EDIT activity ", error);
  }
};
