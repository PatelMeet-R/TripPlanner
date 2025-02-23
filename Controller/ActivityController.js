const { Trip } = require("../Model/Trip");
const { Activity } = require("../Model/activity");
const ExpressError = require("../Utils/Error/ExpressError");
const { wrapAsync } = require("../Utils/wrapAsync");

module.exports.createActivity = wrapAsync(async (req, res) => {
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
});

module.exports.destroyActivity = wrapAsync(async (req, res) => {
  let { id, actId } = req.params;
  let trip = await Trip.findByIdAndUpdate(id, {
    $pull: { activityDetails: actId },
  });
  if (!trip) {
    throw new ExpressError(404, "No trips found.");
  }
  await Activity.findByIdAndDelete(actId);
  req.flash("success", "The activity was successfully deleted.");
  res.redirect(`/trips/${id}`);
});

module.exports.editActivity = wrapAsync(async (req, res) => {
  const { id, actId } = req.params;
  const updatedActivity = await Activity.findByIdAndUpdate(
    actId,
    req.body.activity,
    { new: true }
  );
  if (!updatedActivity) {
    throw new ExpressError(404, "Activity not found.");
  }
  req.flash("success", "The activity has been successfully updated.");
  res.redirect(`/trips/${id}`);
});
