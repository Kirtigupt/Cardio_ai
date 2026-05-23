import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bell,
  Settings,
  HeartPulse,
  Activity
} from "lucide-react";

export default function Sidebar() {
  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/live-monitor", label: "Live Monitor", icon: Activity },
    { to: "/patients", label: "Patients", icon: Users },
    { to: "/alerts", label: "Alerts", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/profile", label: "Profile", icon: Users },
    {to: "/add-patient", label: "Add Patient", icon: Users },
  ];

  return (
    <aside className="w-64 h-screen bg-sidebar-bg dark:bg-slate-900 text-white flex flex-col shadow-xl border-r border-white/5 dark:border-slate-800">
      {/* Logo + Branding */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="bg-brand-600 p-2 rounded-lg shadow-md">
          <HeartPulse className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">CardioAI</h1>
          <p className="text-xs text-slate-300">
            Real-time Cardiac Monitoring
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition 
              ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom System Status */}
      <div className="p-4 border-t border-white/10 text-xs">
        <p className="text-slate-300">
          System Status:
          <span className="text-emerald-400 font-medium ml-1">● Online</span>
        </p>
      </div>
    </aside>
  );
}
