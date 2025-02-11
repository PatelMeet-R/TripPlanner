const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  initialpoint: {
    type: String,
    required: true,
  },
  destination: {
    country: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  budget: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Planned", "OnTrip", "Delayed", "Complete"],
    default: "Planned",
  },
  activityDetails: [
    {
      type: Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
  },
});
module.exports.Trip = mongoose.model("Trip", tripSchema);
