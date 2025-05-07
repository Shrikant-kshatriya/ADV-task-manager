"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { initSocket } from "@/context/SocketContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { setUser } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/user");
        if (res?.data?.username) {
          router.push("/dashboard");
        }
      } catch (err) {
        // Not logged in, no action
      }
    };
    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await api.post("/auth/login", form);
      toast.success("Login successful!");
      setUser(user.data.user); // Set user in context
  
      // Initialize socket with user ID after login
      initSocket(user.data.user._id);
  
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
    }
  };
  

  return (
    <div className="flex items-center justify-center bg-gray-950 text-white" style={{ minHeight: "calc(100vh - 130px)" }}>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-4 py-2 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
        >
          Login
        </button>

        <p className="text-center text-sm">
          Don&apos;t have an account? <a href="/register" className="text-green-400 hover:underline">Register</a>
        </p>
      </form>
    </div>
  );
}
