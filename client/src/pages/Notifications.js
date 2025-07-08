import React, { useState } from "react";
import { CheckSquare, Check, Trash2 } from "lucide-react";
import { format } from "date-fns";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      _id: "1",
      title: "New Task Assigned",
      message:
        "You have been assigned a new task: 'Image Compression' by Shanvitha Guntupalli",
      createdAt: "2025-07-06T11:37:00Z",
      isRead: false,
      type: "task_assigned",
    },
    {
      _id: "2",
      title: "New Task Assigned",
      message:
        "You have been assigned a new task: 'Image Segmentation Assignment' by Sai Rishika Kotnani",
      createdAt: "2025-07-06T11:34:00Z",
      isRead: false,
      type: "task_assigned",
    },
  ]);
  const [filter, setFilter] = useState("all");

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex flex-col h-full p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          You have {unreadCount} unread notification
          {unreadCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${
            filter === "all" ? "bg-blue-100 text-blue-600" : "text-gray-500"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg ${
            filter === "unread" ? "bg-blue-100 text-blue-600" : "text-gray-500"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-4 py-2 rounded-lg ${
            filter === "read" ? "bg-blue-100 text-blue-600" : "text-gray-500"
          }`}
        >
          Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No notifications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border ${
                  !notification.isRead
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`w-5 h-5 mt-1 mr-3 border rounded-sm flex items-center justify-center ${
                      !notification.isRead
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {notification.isRead && (
                      <Check className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="text-gray-400 hover:text-blue-600"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      {format(
                        new Date(notification.createdAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <CheckSquare className="w-4 h-4" />
            Mark All as Read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
