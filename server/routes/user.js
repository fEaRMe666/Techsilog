const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const auth = require("../auth");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", auth.verify, userController.getUserDetails);
router.get("/getUserProfile/:userId", userController.getUserProfile);

module.exports = router;
