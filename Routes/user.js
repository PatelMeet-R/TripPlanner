const {
  renderSignUPForm,
  signUpUser,
  renderLoginForm,
  loginRequest,
  logOutRequest,
} = require("../Controller/AuthController.js");

const express = require("express");
const router = express.Router();

router.route("/signup").get(renderSignUPForm).post(signUpUser);
router.route("/login").get(renderLoginForm).post(loginRequest);

router.post("/logout", logOutRequest);
module.exports.authRouter = router;
