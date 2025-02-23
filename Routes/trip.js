const express = require("express");

const {
  index,
  renderTripForm,
  createTrip,
  showTrip,
  renderEditTrip,
  editTrip,
  destroyTrip,
  searchRequest,
} = require("../Controller/TripController.js");
const {
  isAuthenticate,
  isValidateTripCreator,
  validateTripData,
} = require("../Middleware.js");
const router = express.Router();

router.route("/new").get(isAuthenticate, renderTripForm);
router.route("/search").get(searchRequest);
router.route("/").get(index).post(isAuthenticate, validateTripData, createTrip);
router
  .route("/:id")
  .get(showTrip)
  .put(isAuthenticate, isValidateTripCreator, validateTripData, editTrip)
  .delete(isAuthenticate, isValidateTripCreator, destroyTrip);
router
  .route("/:id/edit")
  .get(isAuthenticate, isValidateTripCreator, renderEditTrip);

module.exports.TripRouter = router;
