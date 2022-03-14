const mongoose = require("mongoose");

const notificationsSchema = mongoose.Schema({
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Notification = mongoose.model("Notifications", notificationsSchema);

module.exports = Notification;
