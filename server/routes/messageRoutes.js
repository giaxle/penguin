const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  sendMessage,
  allMessages,
  // newNotification,
  // allNotifications,
} = require("../controllers/messageController");

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
// router.route("/notification").post(protect, newNotification);
// router.route("/notification/:userId").get(protect, allNotifications);

module.exports = router;
