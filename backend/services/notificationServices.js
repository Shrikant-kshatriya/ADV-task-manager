const Notification = require("../models/Notification.js");

const getNotificationsByUserId = async (userId) => {
  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    return notifications;
  } catch (err) {
    return { err, message: err.message };
  }
};

const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();

    const userId = notification.userId.toString();
    if (global.io && global.connectedUsers.has(userId)) {
      global.io.to(userId).emit("new_notification", notification);
      console.log(`Notification sent to user ${userId}`);
    } else {
      console.log(`ℹUser ${userId} not connected`);
    }

    return notification;
  } catch (err) {
    console.error("Notification Error:", err.message);
    return { err, message: err.message };
  }
};

const markNotificationAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      throw new Error("Notification not found");
    }
    return notification;
  } catch (err) {
    return { err, message: err.message };
  }
};

const deleteNotification = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    return notification;
  } catch (err) {
    return { err, message: err.message };
  }
};

module.exports = {
  getNotificationsByUserId,
  createNotification,
  markNotificationAsRead,
  deleteNotification,
};
