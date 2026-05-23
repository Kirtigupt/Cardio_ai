import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPatients, deletePatient, updatePatient } from "../api/api";
import EditPatientModal from "../Components/EditPatientModal";
import { io } from "socket.io-client";

const Patients = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedWard, setSelectedWard] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [editingPatient, setEditingPatient] = useState(null);

  const navigate = useNavigate();

  const wards = ["ICU", "General", "Emergency", "Cardiology"];
  const statuses = ["critical", "warning", "normal"];

  // Highlighting for alerts
  const [highlightedId, setHighlightedId] = useState(null);
  const [highlightSeverity, setHighlightSeverity] = useState(null);

  /* -------------------------
     LOAD PATIENT LIST
  ------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPatients({ pageSize: 500 });
        setList(res.patients || res);
      } catch (err) {
        console.error("Load error:", err);
      }
    };
    load();
  }, []);

  /* -------------------------
     SOCKET — LISTEN FOR ALERT (NO SOUND HERE)
  ------------------------- */
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("new-alert", (alert) => {
      const pid = alert?.patient?._id;
      const sev = alert?.severity;

      setHighlightedId(pid);
      setHighlightSeverity(sev);

      // Auto clear highlight
      setTimeout(() => setHighlightedId(null), 3000);

      // Scroll into view for visibility
      const element = document.getElementById(`patient-${pid}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    return () => socket.disconnect();
  }, []);

  /* -------------------------
     DELETE PATIENT
  ------------------------- */
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this patient?")) return;

    try {
      await deletePatient(id);
      setList((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  /* -------------------------
     UPDATE PATIENT
  ------------------------- */
  const handleEditSave = async (data) => {
    try {
      const updated = await updatePatient(editingPatient._id, data);
      setList((prev) =>
        prev.map((p) =>
          p._id === updated.updatedPatient._id ? updated.updatedPatient : p
        )
      );
      setEditingPatient(null);
    } catch {
      alert("Update failed");
    }
  };

  /* -------------------------
     FILTER LOGIC
  ------------------------- */
  const filtered = list.filter((p) => {
    const matchSearch =
      (String(p.name || "").toLowerCase()).includes(search.toLowerCase()) ||
      (String(p.bed || "").toLowerCase()).includes(search.toLowerCase());

    const matchWard = selectedWard === "all" || p.ward === selectedWard;
    const matchStatus = selectedStatus === "all" || p.status === selectedStatus;

    return matchSearch && matchWard && matchStatus;
  });

  /* -------------------------
     STATUS COLORS
  ------------------------- */
  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      case "normal":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  /* -------------------------
     ALERT HIGHLIGHT
  ------------------------- */
  const getHighlightClass = (id) => {
    if (highlightedId !== id) return "";

    if (highlightSeverity === "critical")
      return "animate-pulse bg-red-50 dark:bg-red-900/20 border-red-500 ring-2 ring-red-400";

    if (highlightSeverity === "warning")
      return "animate-pulse bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 ring-2 ring-yellow-400";

    return "animate-pulse bg-blue-50 dark:bg-blue-900/20 border-blue-400 ring-2 ring-blue-300";
  };

  return (
    <div className="space-y-8">
      {editingPatient && (
        <EditPatientModal
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Patient Registry</h2>
          <p className="text-slate-600 dark:text-slate-400">Search, filter, and manage all patients</p>
        </div>

        <button
          onClick={() => navigate("/add-patient")}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow"
        >
          + Add Patient
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow flex items-center gap-3 border border-gray-200 dark:border-slate-700">
        <input
          type="text"
          placeholder="Search by name or bed…"
          className="flex-1 px-4 py-2 border dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900/50 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => {
            setSearch("");
            setSelectedWard("all");
            setSelectedStatus("all");
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 dark:text-slate-200 rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600"
        >
          Reset
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ward Filter */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow border border-gray-200 dark:border-slate-700">
          <p className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Ward</p>
          <div className="flex gap-2 flex-wrap">
            {["all", ...wards].map((ward) => (
              <button
                key={ward}
                className={`px-3 py-1 rounded-full border shadow-sm ${
                  selectedWard === ward 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 dark:text-slate-300"
                }`}
                onClick={() => setSelectedWard(ward)}
              >
                {ward === "all" ? "All" : ward}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow border border-gray-200 dark:border-slate-700">
          <p className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Status</p>
          <div className="flex gap-2 flex-wrap">
            {["all", ...statuses].map((s) => (
              <button
                key={s}
                className={`px-3 py-1 rounded-full border shadow-sm ${
                  selectedStatus === s 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 dark:text-slate-300"
                }`}
                onClick={() => setSelectedStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PATIENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((patient) => (
          <div
            id={`patient-${patient._id}`}
            key={patient._id}
            onClick={() => navigate(`/patient/${patient._id}`)}
            className={`bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border dark:border-slate-700 transition-all cursor-pointer hover:shadow-lg dark:hover:shadow-slate-900/50
              ${getHighlightClass(patient._id)}
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{patient.name}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Bed {patient.bed} • Age {patient.age}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">{patient.ward}</p>
              </div>

              <div className="flex flex-col items-end">
                {/* STATUS BADGE */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    patient.status
                  )}`}
                >
                  {patient.status}
                </span>

                {/* NEW ALERT BADGE */}
                {highlightedId === patient._id && (
                  <span className="mt-2 px-3 py-1 text-xs font-bold bg-red-600 text-white rounded-full shadow">
                    NEW ALERT
                  </span>
                )}
              </div>
            </div>

            {/* VITALS */}
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-700 dark:text-slate-300">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                HR: {patient.currentVitals?.heartRate || 0} bpm
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                SpO₂: {patient.currentVitals?.spO2 || 0}%
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                BP: {patient.currentVitals?.bloodPressure || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Temp: {patient.currentVitals?.temperature || 0} °C
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingPatient(patient);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={(e) => handleDelete(e, patient._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 py-20">
          No matching patients.
        </p>
      )}
    </div>
  );
};

export default Patients;
