const express = require("express");

const {
  createActivity,
  destroyActivity,
  editActivity,
} = require("../Controller/activity");
const router = express.Router({ mergeParams: true });

// new route
router.post("/", createActivity);

router.route("/:actId").delete(destroyActivity).put(editActivity);

module.exports = router;
