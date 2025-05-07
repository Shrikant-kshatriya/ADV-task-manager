"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import api from "@/utils/api";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { getSocket } from "@/context/SocketContext";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/user/my-notifications", {
          withCredentials: true,
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
  
    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };
  
    socket.on("new_notification", handleNewNotification);
    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, []);
  

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/user/my-notifications/${id}`, {}, { withCredentials: true });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-8 h-8"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-xs text-white flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
            className="absolute right-0 mt-3 w-80 bg-[#1f1f1f] text-white rounded-xl shadow-xl z-50 border border-gray-700 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-[#2a2a2a]">
              <span className="font-semibold text-lg">Notifications</span>
            </div>

            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-400">No notifications yet.</div>
            ) : (
              <ul className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n._id}
                    onClick={() => handleMarkRead(n._id)}
                    className={`flex gap-3 px-4 py-4 text-sm cursor-pointer items-start transition-all duration-200 ${
                      n.isRead
                        ? "bg-[#1a1a1a] text-gray-500"
                        : "bg-[#101820] text-white hover:bg-[#172230]"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 mt-1 rounded-full ${
                        n.isRead ? "bg-gray-600" : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div
                        className={`${
                          n.isRead ? "font-normal" : "font-semibold"
                        } leading-snug`}
                      >
                        {n.message}
                      </div>
                      <div className="text-xs mt-1 text-gray-400">
                        {moment(n.createdAt).fromNow()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
