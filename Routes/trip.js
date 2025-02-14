const express = require("express");

const {
  index,
  renderTripForm,
  createTrip,
  showTrip,
  renderEditTrip,
  editTrip,
  destroyTrip,
} = require("../Controller/trip");
const router = express.Router();

router.route("/").get(index).post(createTrip);
router.route("/new", renderTripForm);
router.route("/:id").get(showTrip).put(editTrip);
router.delete("/:id", destroyTrip);
router.route("/:id/edit").get(renderEditTrip);

module.exports = router;
