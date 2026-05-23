import { useEffect, useState } from "react";
import { getAlerts, deleteAlert, deleteAllAlerts } from "../api/api";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  /* -------------------------
      LOAD ALERTS INITIALLY
  ------------------------- */
  const loadAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error("Error loading alerts:", err);
    }
  };

  useEffect(() => {
    loadAlerts();

    const socket = io("http://localhost:5000");

    // No sound here — sound handled globally
    socket.on("new-alert", (alert) => {
      setAlerts((prev) => [alert, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const getSeverityBar = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-600";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-slate-400 dark:bg-slate-600";
    }
  };

  const getCardBg = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-300 dark:bg-yellow-950/30 dark:border-yellow-800";
      default:
        return "bg-slate-50 border-slate-300 dark:bg-slate-800 dark:border-slate-700";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this alert?")) return;

    try {
      await deleteAlert(id);
      setAlerts((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert("Failed to delete alert");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL alerts?")) return;

    try {
      await deleteAllAlerts();
      setAlerts([]);
    } catch {
      alert("Failed to delete all");
    }
  };

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Alert Center</h2>
        <p className="text-slate-600 dark:text-slate-400">Live alerts from all monitored patients</p>
      </div>

      {/* DELETE ALL */}
      <div className="flex justify-end">
        <button
          onClick={handleDeleteAll}
          className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg"
        >
          Delete All Alerts
        </button>
      </div>

      {/* ALERT LIST */}
      <div className="space-y-5">
        {alerts.map((alert) => {
          const p = alert.patient || {};

          return (
            <div
              key={alert._id}
              className={`border rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer ${getCardBg(
                alert.severity
              )}`}
              onClick={() => navigate(`/patient/${p?._id}`)}
            >
              {/* Severity Bar */}
              <div className={`h-2 w-full ${getSeverityBar(alert.severity)}`} />

              <div className="p-6">
                {/* Top Row */}
                <div className="flex justify-between items-start">
                  <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      {alert.message}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className="px-3 py-1 rounded-lg text-sm font-bold bg-white dark:bg-slate-800 dark:text-slate-200 shadow border border-slate-200 dark:border-slate-700"
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>

                {/* Patient Info */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Patient</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{p.name ?? "--"}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Bed</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{p.bed ?? "--"}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Ward</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{p.ward ?? "--"}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Vitals</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      HR: {p.heartRate ?? "--"} • SpO₂: {p.spo2 ?? "--"}%
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(alert._id);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {alerts.length === 0 && (
          <p className="text-center text-slate-500 py-20">No alerts available</p>
        )}
      </div>
    </div>
  );
}
 