"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    desc: "",
    status: "pending",
    priority: "low",
    dueDate: "",
    assignedTo: "",
  });
  const [assignedTo, setAssignedTo] = useState(null); 

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await api.get(`/task/${id}`);
      const task = res.data;
      setAssignedTo(task.assignedTo);
      setForm({
        title: task.title,
        desc: task.desc,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate?.slice(0, 16), 
        assignedTo: task.assignedTo._id,
      });
    } catch (err) {
      console.error("Failed to fetch task", err);
      toast.error("Failed to fetch task. Please try again.");
      router.push("/dashboard");
    }
  };


  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/task/${id}`, form);
        toast.success("Task updated successfully!");
      
    } catch (err) {
      console.error("Task update failed", err);
        toast.error("Failed to update task. Please try again.");

    } finally{
        router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-10">
      <div className="max-w-2xl mx-auto bg-[#1c1c1c] p-8 rounded-2xl shadow-md border border-gray-700">
        <h1 className="text-3xl font-bold mb-6">Edit Task</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

        <div>
            <label className="block text-sm mb-1">Assign To</label>
            <select
  disabled
  name="assignedTo"
  value={form.assignedTo}
  onChange={handleChange}
  required
  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
>
  {!assignedTo ? (
    <option>Loading...</option>
  ) : (
    <option value={assignedTo._id}>
      {user._id === assignedTo._id ? "You" : assignedTo.username}
    </option>
  )}
</select>

          </div>

          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="desc"
              value={form.desc}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm mb-1">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="block text-sm mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Due Date</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md transition"
          >
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
}
