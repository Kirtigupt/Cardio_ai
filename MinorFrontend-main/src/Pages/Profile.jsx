import React from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">My Profile</h1>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 max-w-xl">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <User size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{user.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{user.role}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <Mail className="text-blue-500 dark:text-blue-400" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="text-green-500 dark:text-green-400" />
            <span className="capitalize">{user.role}</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-purple-500 dark:text-purple-400" />
            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
