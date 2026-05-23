import React, { useState } from "react";
import { loginUser } from "../api/api"; 
import { useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErr("");
  setLoading(true);

  try {
    const response = await loginUser(form);

    if (!response || !response.user) {
      setErr("Login failed. Try again.");
      setLoading(false);
      return;
    }

    // Save authentication details safely
    localStorage.setItem("token", response.user.token || "");
    localStorage.setItem("user", JSON.stringify(response.user));

    navigate("/");
  } catch (error) {
    console.error("LOGIN ERROR:", error.response?.data || error);

    setErr(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Login failed"
    );
  }

  setLoading(false);
};


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-8">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-brand-600 text-white p-3 rounded-xl shadow-md">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-semibold mt-3 text-slate-800 dark:text-slate-100">
            Welcome Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">
            Login to continue monitoring patients
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {err && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 px-4 py-2 rounded-lg mb-4 text-sm">
            {err}
          </div>
        )}

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
              Email Address
            </label>
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
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Submit Btn */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-brand-600 text-white py-3 rounded-lg font-medium shadow-sm transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-brand-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-5 text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <a href="/register" className="text-brand-600 dark:text-brand-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
