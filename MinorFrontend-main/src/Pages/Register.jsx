import React, { useState } from "react";
import { registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor",
  });

  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await registerUser(form);
    alert("User Registered Successfully");
    navigate("/login");
  } catch (error) {
    console.error("REGISTER ERROR:", error.response?.data || error.message || error);
    setErr(
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Registration failed"
    );
  }
};


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-8">

        {/* LOGO HEADER */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-brand-600 text-white p-3 rounded-xl shadow-md">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-semibold mt-3 text-slate-800 dark:text-slate-100 text-center">
            Create an Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">
            Access the AI-powered cardiac monitoring system
          </p>
        </div>

        {/* ERROR BOX */}
        {err && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 px-4 py-2 rounded-lg mb-4 text-sm">
            {err}
          </div>
        )}

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Role dropdown */}
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Role</label>
            <select
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit BTN */}
          <button
            type="submit"
            className="w-full bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 transition font-medium shadow-sm"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-5 text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <a href="/login" className="text-brand-600 dark:text-brand-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
