const express = require("express");
const {
  userSignUpController,
  signInController,
  autoLoginController,
  getUserInfoById,
  updateUserInfoById,
  getVerificationCode,
  resetPassword,

} = require("../../Controllers/Auth.Controllers");
const router = express.Router();

// sign up routes
router.post("/signup", userSignUpController);
router.post("/signin", signInController);
router.post("/autosignin", autoLoginController);
router.get("/getUserInfoById/:id", getUserInfoById);
router.patch("/updateUserInfoById/:id", updateUserInfoById);
router.post('/getVerificationCode', getVerificationCode)
router.post('/resetPassword', resetPassword)

module.exports = router;
