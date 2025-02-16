const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  actName: {
    type: String,
    required: true,
  },
  actnote: {
    type: String,
    required: true,
  },
  actlocation: {
    type: String,
    required: true,
  },
  actcategory: {
    type: String,
    required: true,
  },
  actcost: {
    type: Number,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  actstatus: {
    type: String,
    enum: ["Pending", "Rejected", "Accepted"],
    default: "Pending",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  ActivityCreator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports.Activity = mongoose.model("Activity", activitySchema);
