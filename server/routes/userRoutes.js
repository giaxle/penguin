const express = require("express");
const router = express.Router();
const {
  register,
  login,
  allUsers,
} = require("./../controllers/userController");
const { protect } = require("../middleware/auth");

router.route("/register").post(register);
router.route("/login").post(login);

router.route("/").get(protect, allUsers);

module.exports = router;
