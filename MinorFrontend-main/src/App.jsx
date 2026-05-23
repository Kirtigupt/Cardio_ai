import { Routes, Route, useLocation } from "react-router-dom";

import Dashboard from './Pages/Dashboard';
import Patients from './Pages/Patients';
import PatientDetail from './Pages/PatientDetail';
import LiveMonitor from './Pages/LiveMonitor';
import Alerts from './Pages/Alerts';
import Settings from './Pages/Settings';
import AddPatient from "./Pages/AddPatient";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";

import Sidebar from './Components/Layout/Sidebar';
import Header from './Components/Layout/Header';
import PrivateRoute from './Components/PrivateRoute';


export default function App() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-slate-950 transition-colors">

      {/* Sidebar visible only when logged in and not on auth pages */}
      {token && !isAuthPage && <Sidebar />}

      <div className="flex-1 flex flex-col">

        {/* Header visible only when logged in and not on auth pages */}
        {token && !isAuthPage && <Header />}

        <main className="flex-1 overflow-auto p-6">

          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/patients"
              element={
                <PrivateRoute>
                  <Patients />
                </PrivateRoute>
              }
            />

            <Route
              path="/live-monitor"
              element={
                <PrivateRoute>
                  <LiveMonitor />
                </PrivateRoute>
              }
            />

            <Route
              path="/patient/:id"
              element={
                <PrivateRoute>
                  <PatientDetail />
                </PrivateRoute>
              }
            />

            <Route
              path="/alerts"
              element={
                <PrivateRoute>
                  <Alerts />
                </PrivateRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            <Route
              path="/add-patient"
              element={
                <PrivateRoute>
                  <AddPatient />
                </PrivateRoute>
              }
            />
          </Routes>
          
        </main>
      </div>
    </div>
  );
}
