"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Search } from "lucide-react";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [activeSection, setActiveSection] = useState("created");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    dueDate: "",
  });

  // Fetch tasks dynamically based on section
  useEffect(() => {
    const fetchTasks = async () => {
      let endpoint = "";
      if (activeSection === "created") {
        endpoint = "/task/by-me";
      } else if (activeSection === "assigned") {
        endpoint = "/task/to-me";
      } else if (activeSection === "overdue") {
        endpoint = "/task/to-me"; // We’ll still use 'to-me' and filter overdue tasks later
      }

      const res = await api.get(endpoint);
      setTasks(res.data.reverse());
    };

    fetchTasks();
  }, [activeSection]);

  // Helper function to filter tasks
  const applyFilters = (task) => {
    const matchSearch = task.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchStatus = filters.status ? task.status === filters.status : true;
    const matchPriority = filters.priority
      ? task.priority === filters.priority
      : true;
      const matchDueDate = filters.dueDate
    ? new Date(task.dueDate) <= new Date(filters.dueDate + "T23:59:59")
    : true;
    

    return matchSearch && matchStatus && matchPriority && matchDueDate;
  };

  // Filter tasks based on the active section and apply filters
  const filteredTasks = tasks.filter((task) => {
    if (activeSection === "created")
      return task.assignedBy._id === user._id && applyFilters(task);
    if (activeSection === "assigned")
      return task.assignedTo._id === user._id && applyFilters(task);
    if (activeSection === "overdue") {
      const isOverdue =
        new Date(task.dueDate) < new Date() && task.status !== "completed";
      return (
        task.assignedTo._id === user._id && isOverdue && applyFilters(task)
      );
    }
    return false;
  });

  // edit task function
  const onEdit = async (taskId) => {
    try {
      router.push(`/edit-task/${taskId}`);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const onDelete = async (taskId) => {
    try {
      await api.delete(`/task/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const onStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/task/${taskId}`, { status });
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
      toast.success("Task status updated successfully!");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again.");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto flex-wrap">
          <select
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="bg-gray-800 px-3 py-2 rounded"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className="bg-gray-800 px-3 py-2 rounded"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            onChange={(e) =>
              setFilters({ ...filters, dueDate: e.target.value })
            }
            className="bg-gray-800 px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="flex justify-around border-b border-gray-700 pb-4 text-sm md:text-base">
        <button
          className={`px-4 py-2 ${
            activeSection === "created"
              ? "border-b-2 border-green-500 text-white"
              : "text-gray-400"
          }`}
          onClick={() => setActiveSection("created")}
        >
          Created by Me
        </button>
        <button
          className={`px-4 py-2 ${
            activeSection === "assigned"
              ? "border-b-2 border-green-500 text-white"
              : "text-gray-400"
          }`}
          onClick={() => setActiveSection("assigned")}
        >
          Assigned to Me
        </button>
        <button
          className={`px-4 py-2 ${
            activeSection === "overdue"
              ? "border-b-2 border-red-500 text-white"
              : "text-gray-400"
          }`}
          onClick={() => setActiveSection("overdue")}
        >
          Overdue Tasks
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              activeSection={activeSection}
              task={task}
              user={user}
              onClick={() => setSelectedTask(task)}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No tasks found.
          </p>
        )}
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
