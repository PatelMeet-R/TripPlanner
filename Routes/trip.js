const express = require("express");

const {
  index,
  renderTripForm,
  createTrip,
  showTrip,
  renderEditTrip,
  editTrip,
  destroyTrip,
} = require("../Controller/TripController.js");
const { isAuthenticate, isValidateTripCreator } = require("../Middleware.js");
const router = express.Router();

router.route("/new").get(isAuthenticate, renderTripForm);
router.route("/").get(index).post(isAuthenticate, createTrip);
router
  .route("/:id")
  .get(showTrip)
  .put(isAuthenticate, isValidateTripCreator, editTrip)
  .delete(isAuthenticate, isValidateTripCreator, destroyTrip);
router
  .route("/:id/edit")
  .get(isAuthenticate, isValidateTripCreator, renderEditTrip);

module.exports.TripRouter = router;
