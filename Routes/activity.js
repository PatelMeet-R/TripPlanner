const express = require("express");

const {
  createActivity,
  destroyActivity,
  editActivity,
} = require("../Controller/ActivityController.js");
const { isAuthenticate, isValidateActivityCreator, isValidateTripCreator } = require("../Middleware.js");
const router = express.Router({ mergeParams: true });

router.post("/", isAuthenticate, createActivity);

router
  .route("/:actId")
  .delete(isAuthenticate, isValidateActivityCreator,destroyActivity)
  .put(isAuthenticate, isValidateActivityCreator,isValidateTripCreator, editActivity);

module.exports.ActivityRouter = router;
