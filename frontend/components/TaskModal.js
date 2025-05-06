"use client";
import { X, CalendarDays, Flag, UserCheck, UserPlus, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskModal({ task, onClose }) {
  const priorityColors = {
    low: "text-green-400",
    medium: "text-yellow-400",
    high: "text-red-500",
  };

  const statusColors = {
    pending: "bg-yellow-500",
    "in-progress": "bg-blue-500",
    completed: "bg-green-500",
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{
            y: "100%", // Start from the bottom
            x: "100%", // Start from the right
            scale: 0.8, // Start small (like folded paper)
            rotate: 10, // Slight rotation to simulate the unfolding
          }}
          animate={{
            y: 0, // Move to the center vertically
            x: 0, // Move to the center horizontally
            scale: 1, // Scale to original size
            rotate: 0, // No rotation when fully open
          }}
          exit={{
            y: "100%", // Exit back to the bottom
            x: "100%", // Exit back to the right
            scale: 0.8, // Shrink back down
            rotate: 10, // Rotate slightly when closing
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
            duration: 0.5, // Slightly quicker for a pop-out feel
          }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 w-full max-w-lg md:rounded-2xl rounded-t-2xl p-6 shadow-xl relative"
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            onClick={onClose}
          >
            <X size={28} />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-4">{task.title}</h2>

          {/* Description */}
          {task.desc && (
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {task.desc}
            </p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base text-gray-200">
            <InfoItem
              icon={<CalendarDays className="text-blue-400" size={20} />}
              label="Due Date"
              value={new Date(task.dueDate).toLocaleDateString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            />
            <InfoItem
              icon={<Clock className="text-purple-400" size={20} />}
              label="Created At"
              value={new Date(task.createdAt).toLocaleString()}
            />
            <InfoItem
              icon={<UserPlus className="text-green-400" size={20} />}
              label="Assigned By"
              value={task.assignedBy?.username || "N/A"}
            />
            <InfoItem
              icon={<UserCheck className="text-orange-400" size={20} />}
              label="Assigned To"
              value={task.assignedTo?.username || "N/A"}
            />
            <InfoItem
              icon={<Flag className="text-red-400" size={20} />}
              label="Priority"
              value={
                <span className={`${priorityColors[task.priority]} capitalize`}>
                  {task.priority}
                </span>
              }
            />
            <InfoItem
              icon={
                <div
                  className={`w-3 h-3 rounded-full ${statusColors[task.status]}`}
                />
              }
              label="Status"
              value={<span className="capitalize">{task.status}</span>}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-base font-medium text-white">{value}</div>
      </div>
    </div>
  );
}
