const { Trip } = require("../Model/Trip");
const { Activity } = require("../Model/activity");

module.exports.createActivity = async (req, res) => {
  try {
    let { id } = req.params;
    let trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    let activity = new Activity(req.body.activity);
    trip.activityDetails.push(activity);
    await activity.save();
    await trip.save();
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
    res.redirect(`/trips/${id}`);
  } catch (error) {
    console.log("this error occure at activities deletaions", error);
  }
};

module.exports.editActivity = async (req, res) => {
  try {
    let { id, actId } = req.params;
    await Activity.findByIdAndUpdate(actId, req.body.activity);
    res.redirect(`/trips/${id}`);
  } catch (error) {
    console.log("this error occure at EDIT activity ", error);
  }
};
