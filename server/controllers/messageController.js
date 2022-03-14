const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User = require("../models/User");
// const Notification = require("../models/Notification");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("invalid data passed into request");
    res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// const newNotification = asyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;

//   if (!content || !chatId) {
//     console.log("invalid data passed into request");
//     res.sendStatus(400);
//   }

//   let newNotification = {
//     sender: req.user._id,
//     content: content,
//     chat: chatId,
//   };

//   try {
//     let notification = await Notification.create(newNotification);
//     notification = await notification.populate("sender", "name pic");
//     notification = await notification.populate("chat");
//     notification = await User.populate(notification, {
//       path: "chat.users",
//       select: "name pic email",
//     });

//     // notification.chat.users.forEach(async (user) => {
//     //   await User.findByIdAndUpdate(
//     //     user._id,
//     //     { $push: { notifications: notification } },
//     //     { new: true }
//     //   );
//     //   console.log(user.notifications);
//     // });

//     res.json(notification);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });

// const allNotifications = asyncHandler(async (req, res) => {
//   try {
//   } catch (error) {}
// });

// const removeNotification = asyncHandler(async (req, res) => {});

module.exports = {
  sendMessage,
  allMessages,
  // newNotification,
  // allNotifications,
};
