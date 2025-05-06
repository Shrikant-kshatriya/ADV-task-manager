import { Pencil, Trash2 } from "lucide-react";

const PriorityColors = {
  high: 'bg-rose-500 text-white',     // More contrast red
  medium: 'bg-amber-400 text-gray-900', // Readable amber with dark text
  low: 'bg-sky-500 text-white',       // Softer blue
  default: 'bg-gray-600 text-white',
};

const StatusColors = {
  pending: 'bg-orange-500 text-white',
  'in-progress': 'bg-blue-500 text-white',
  completed: 'bg-green-500 text-white',
};

export default function TaskCard({
  task,
  activeSection,
  user,
  onClick,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const isCreator = task.assignedBy._id === user._id;
  const isAssignee = task.assignedTo._id === user._id;

  const getPriorityColor = (priority) => PriorityColors[priority] || PriorityColors.default;
  const getStatusColor = (status) => StatusColors[status] || 'bg-gray-700 text-white';

  const formatIST = (dateStr) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + " IST"
    );
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    onStatusChange(task._id, e.target.value);
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col justify-between hover:ring-2 hover:ring-sky-500 transition duration-300 group space-y-4 border border-gray-700"
    >
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-100 line-clamp-1">{task.title}</h2>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
        {task.desc?.length > 180 ? `${task.desc.slice(0, 180)}...` : task.desc}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        <span
          className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(
            task.priority
          )}`}
        >
          Priority: {task.priority}
        </span>
        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
          Status: {task.status}
        </span>
        <span className="text-xs bg-gray-700 text-white px-3 py-1 rounded-full">
          Due: {formatIST(task.dueDate)}
        </span>
      </div>

      {/* Meta & Actions */}
      <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-700">
        {/* Meta Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <span className="text-gray-600">Assigned To:</span>{" "}
            {isAssignee ? "You" : task.assignedTo.username}
          </p>
          <p>
            <span className="text-gray-600">Assigned By:</span>{" "}
            {isCreator ? "You" : task.assignedBy.username}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 items-center">
          {activeSection === "created" ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task._id);
                }}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white transition"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task._id);
                }}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white transition"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </>
          ) : (
            <select
              onClick={(e) => e.stopPropagation()}
              onChange={handleStatusChange}
              value={task.status}
              className="text-xs bg-gray-700 text-white px-2 py-1 rounded-md border border-gray-600 focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
}