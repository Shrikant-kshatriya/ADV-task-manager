"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-toastify";

export default function CreateTaskPage() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    status: "pending",
    priority: "low",
    dueDate: "",
    assignedTo: "",
    assignedBy: "",
  });

  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/all");
      const loggedInUserRes = await api.get("/user"); 
      const me = loggedInUserRes.data;

      setCurrentUserId(me._id);
        setForm((prev) => ({ ...prev, assignedBy: me._id })); 

      const sortedUsers = [
        { ...me, username: "You" },
        ...res.data.filter((u) => u._id !== me._id),
      ];
      setUsers(sortedUsers);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/task", form);
      toast.success("Task created successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Task creation failed", err);
        toast.error("Failed to create task. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto bg-[#1e1e1e] p-10 rounded-3xl shadow-xl border border-gray-700">
        <h1 className="text-4xl font-semibold mb-8 text-center">📝 Create New Task</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Assign To */}
          <div>
            <label className="block text-sm font-medium mb-2">Assign To</label>
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none"
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="e.g. Fix user login bug"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="desc"
              value={form.desc}
              onChange={handleChange}
              rows={5}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Provide a detailed description of the task..."
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none"
            />
          </div>


          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold text-lg py-3 rounded-lg transition"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
