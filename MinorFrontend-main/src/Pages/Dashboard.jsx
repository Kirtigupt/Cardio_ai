import React, { useEffect, useState } from "react";
import { getPatients, getAlerts } from "../api/api";
import StatCard from "../Components/Common/StatCard.jsx";
import { Activity, Bell, Users, AlertTriangle, Heart } from "lucide-react";
import { socket } from "../socket";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [averageHR, setAverageHR] = useState(0);

  useEffect(() => {
    loadDashboard();

    // Listen for real-time vitals updates
    socket.on("vitalsUpdate", (updatedPatient) => {
      setPatients(prev => prev.map(p => p._id === updatedPatient._id ? updatedPatient : p));
    });

    // Listen for new alerts
    socket.on("newAlert", (newAlerts) => {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 50));
    });

    return () => {
      socket.off("vitalsUpdate");
      socket.off("newAlert");
    };
  }, []);

  useEffect(() => {
    // Compute average heart rate
    const hrValues = patients
      .map((pat) => pat.currentVitals?.heartRate || pat.heartRate)
      .filter((v) => typeof v === "number" && v > 0);

    const avg = hrValues.length
      ? Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length)
      : 0;

    setAverageHR(avg);
  }, [patients]);

  const loadDashboard = async () => {
    const p = await getPatients();
    const a = await getAlerts();

    const safePatients =
      Array.isArray(p?.patients) ? p.patients : Array.isArray(p) ? p : [];

    const safeAlerts =
      Array.isArray(a?.alerts) ? a.alerts : Array.isArray(a) ? a : [];

    setPatients(safePatients);
    setAlerts(safeAlerts);
  };

  // 🔥 Severity classification based on message text
  const getSeverityFromMessage = (msg) => {
    msg = msg.toLowerCase();

    if (
      msg.includes("drop") ||
      msg.includes("sudden") ||
      msg.includes("critical") ||
      msg.includes("abnormal") ||
      msg.includes("danger")
    ) {
      return "critical";
    }

    if (
      msg.includes("slight") ||
      msg.includes("mild") ||
      msg.includes("elevated") ||
      msg.includes("increase")
    ) {
      return "warning";
    }

    return "normal";
  };

  const criticalPatients = patients.filter(
    (p) => p.status?.toLowerCase() === "critical"
  );

  return (
    <div className="p-6 space-y-8">

      {/* Header Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Real-time monitoring of patients & critical alerts.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <StatCard
          label="Total Patients"
          value={patients.length}
          icon={<Users />}
          color="blue"
          trend="up"
          percentage={5}
          graphPoints={[10, 20, 15, 30, 22, 40]}
        />

        <StatCard
          label="Active Alerts"
          value={alerts.length}
          icon={<Bell />}
          color="red"
          trend="down"
          percentage={3}
          graphPoints={[6, 10, 8, 15, 9, 5]}
        />

        <StatCard
          label="Critical Patients"
          value={criticalPatients.length}
          icon={<AlertTriangle />}
          color="yellow"
          trend="up"
          percentage={8}
          graphPoints={[4, 9, 5, 12, 10, 14]}
        />

        <StatCard
          label="Average Heart Rate"
          value={`${averageHR} bpm`}
          icon={<Heart />}
          color="green"
          trend="up"
          percentage={4}
          graphPoints={[20, 18, 25, 22, 28, 30]}
        />

      </div>

      {/* RECENT ALERTS (LEFT) + AI SUMMARY (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 🔥 RECENT ALERTS (LEFT SIDE) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            ⚠️ Recent Alerts
          </h2>

          {alerts.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No alerts right now.</p>
          ) : (
            alerts.slice(0, 6).map((alert) => {
              const severity = getSeverityFromMessage(alert.message);

              const severityStripe = {
                critical: "bg-red-600",
                warning: "bg-yellow-500",
                normal: "bg-green-500",
              };

              const badgeStyle = {
                critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                normal: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
              };

              return (
                <div
                  key={alert._id}
                  className="
                    flex items-start gap-4 mb-4 p-4 border border-slate-200 dark:border-slate-700 
                    rounded-xl hover:shadow-md transition cursor-pointer bg-white dark:bg-slate-800/50
                  "
                >
                  {/* Colored severity stripe */}
                  <div
                    className={`w-2 rounded-full ${severityStripe[severity]}`}
                  ></div>

                  <div className="flex-1">
                    {/* Message + Badge */}
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        {alert.message}
                      </p>

                      <span
                        className={`text-xs px-2 py-1 rounded-lg font-medium capitalize ${badgeStyle[severity]}`}
                      >
                        {severity}
                      </span>
                    </div>

                    {/* Patient + Time */}
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Patient: {alert.patient?.name || "Unknown"} •{" "}
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 🧠 AI SUMMARY (RIGHT SIDE) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
            🧠 AI Summary
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            CardioAI is analyzing ECG, SpO₂, blood pressure, heart rate, and
            temperature continuously.
            <br /> <br />
            <strong>{criticalPatients.length}</strong> patients currently
            require critical attention.  
            <strong>{alerts.length}</strong> alerts have been generated recently.  
            <br /><br />
            Vital trends remain stable across most monitored patients.  
          </p>
        </div>

      </div>
    </div>
  );
}
