import React, { useState, useEffect } from "react";
import { Bell, UserCircle, LogOut, LogIn, UserPlus, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  // Load user info from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 shadow-sm transition-colors">
      
      {/* PAGE TITLE */}
      <div>
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">AI Cardiac Monitoring</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">Real-time clinical dashboard</p>
      </div>

      {/* RIGHT SIDE SECTION */}
      <div className="flex items-center gap-5 relative">

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-slate-600" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-400" />
          )}
        </button>

        {/* Notification Icon */}
        <button className="relative">
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400 hover:text-brand-600 transition" />
        </button>

        {/* IF USER IS NOT LOGGED IN → Show Login/Register */}
        {!user && (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition flex items-center gap-1"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-1.5 rounded-lg border border-brand-600 text-brand-700 text-sm font-medium hover:bg-brand-50 transition flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Register
            </Link>
          </div>
        )}

        {/* IF USER IS LOGGED IN → Show Profile */}
        {user && (
          <div
            className="cursor-pointer flex items-center gap-2"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <div className="h-9 w-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="text-sm">
              <p className="font-semibold text-slate-800 leading-none">{user.name}</p>
              <p className="text-slate-500 text-xs">{user.role}</p>
            </div>

            {/* DROPDOWN */}
            {openMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-slate-200 w-44 p-2 z-40">
                
                <Link to="/profile" className="hover:text-blue-600">Profile</Link>


                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
