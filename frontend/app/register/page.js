"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-950 text-white" style={{ minHeight: "calc(100vh - 130px)" }}>
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded shadow w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold">
          Register
        </button>

        <p className="text-center text-sm">
          Already have an account? <a href="/login" className="text-green-400 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}