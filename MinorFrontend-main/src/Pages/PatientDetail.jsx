import { useParams } from "react-router-dom";
import { Sparkles, Download } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getPatientById,
  postVitals,
  deletePatient,
  updatePatient,
  getPatientSummary,
} from "../api/api";

import VitalsChart from "../Components/VitalsChart";
import EditPatientModal from "../Components/EditPatientModal";
import { generatePDF } from "../utils/pdfGenerator";

// Reusable modal for text editing
const TextEditModal = ({ title, value, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-96 shadow-2xl space-y-4 border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h2>

        <textarea
          id="editTextField"
          defaultValue={value}
          className="w-full h-40 border dark:border-slate-600 rounded-xl p-3 bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave(document.getElementById("editTextField").value)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [summary, setSummary] = useState(null);          // ⭐ Added summary state
  const [summaryLoading, setSummaryLoading] = useState(true); // ⭐ Loading flag

  const [editing, setEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const loadData = async () => {
    try {
      const data = await getPatientById(id);
      setPatient(data);
    } catch (err) {
      console.error("Error loading patient:", err);
    }
  };

  /* -------------------------------
     LOAD PATIENT + SUMMARY
  --------------------------------*/
  useEffect(() => {
    loadData();

    const loadSummaryData = async () => {
      try {
        const s = await getPatientSummary(id);
        setSummary(s);
      } catch (err) {
        console.error("Error loading summary:", err);
      } finally {
        setSummaryLoading(false);
      }
    };

    loadSummaryData();
  }, [id]);

  /* Reload data every 5 seconds (not necessary for summary) */
  useEffect(() => {
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleEditSave = async (updatedFields) => {
    try {
      const updated = await updatePatient(patient._id, updatedFields);
      setPatient(updated);
      setEditing(false);
    } catch {
      alert("Update failed");
    }
  };

  const handleTextSave = async (text) => {
    try {
      const updated = await updatePatient(patient._id, {
        [editingField]: text,
      });
      setPatient(updated);
      setEditingField(null);
    } catch {
      alert("Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await deletePatient(id);
      alert("Patient deleted");
      window.location.href = "/patients";
    } catch {
      alert("Delete failed");
    }
  };

  if (!patient) {
    return (
      <div className="bg-white p-10 rounded-xl shadow text-center">
        Loading patient details...
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-400 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      case "normal":
        return "bg-green-100 text-green-700 border-green-400 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
    }
  };

  return (
    <div id="patient-report-area" className="space-y-8 bg-gray-50 dark:bg-slate-950 p-4 rounded-xl">

      {/* Edit Modals */}
      {editing && (
        <EditPatientModal
          patient={patient}
          onClose={() => setEditing(false)}
          onSave={handleEditSave}
        />
      )}

      {editingField && (
        <TextEditModal
          title={
            editingField === "medicalHistory"
              ? "Edit Medical History"
              : editingField === "notes"
              ? "Edit Patient Notes"
              : "Edit Doctor Instructions"
          }
          value={patient[editingField]}
          onClose={() => setEditingField(null)}
          onSave={handleTextSave}
        />
      )}

      {/* ----------------------- HEADER ----------------------- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{patient.name}</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-lg">
              Bed <span className="font-semibold text-slate-700 dark:text-slate-300">{patient.bed}</span> •{" "}
              Age {patient.age} • {patient.gender} •{" "}
              <span className="font-semibold text-blue-700 dark:text-blue-400">{patient.ward}</span>
            </p>
          </div>

          <span
            className={`px-5 py-2 rounded-full font-semibold border text-lg ${getStatusColor(
              patient.status
            )}`}
          >
            {patient.status.toUpperCase()}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setEditing(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow"
          >
            Edit Patient
          </button>

          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow"
          >
            Delete
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("health-summary");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow"
          >
            View Summary
          </button>
          
          <button
            onClick={() => generatePDF("patient-report-area", `${patient.name}_Report.pdf`)}
            className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow flex items-center gap-2"
          >
            <Download size={18} />
            Download PDF
          </button>

        </div>
      </div>

      {/* ----------------------- VITALS GRID ----------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Heart Rate", value: `${patient.heartRate}`, unit: "bpm", color: "text-red-600 dark:text-red-400" },
          { label: "SpO₂", value: `${patient.spo2}%`, unit: "oxygen", color: "text-blue-600 dark:text-blue-400" },
          { label: "Blood Pressure", value: patient.bp, unit: "mmHg", color: "text-purple-600 dark:text-purple-400" },
          { label: "Temperature", value: `${patient.temp}°C`, unit: "body temp", color: "text-orange-600 dark:text-orange-400" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className={`text-4xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{item.unit}</p>
          </div>
        ))}
      </div>


      {/* ----------------------- AI REASONING ----------------------- */}
      {patient.aiReasoning && (
        <div className={`rounded-2xl shadow-lg p-6 border flex gap-4 items-start ${
          patient.status.toLowerCase() === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
          patient.status.toLowerCase() === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
          'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
        }`}>
          <div className={`p-3 rounded-full ${
            patient.status.toLowerCase() === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' :
            patient.status.toLowerCase() === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400' :
            'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
          }`}>
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-lg font-bold mb-1 ${
              patient.status.toLowerCase() === 'critical' ? 'text-red-800 dark:text-red-300' :
              patient.status.toLowerCase() === 'warning' ? 'text-yellow-800 dark:text-yellow-300' :
              'text-green-800 dark:text-green-300'
            }`}>
              AI Classification: {patient.status.toUpperCase()}
            </h3>
            <p className={`text-base leading-relaxed ${
              patient.status.toLowerCase() === 'critical' ? 'text-red-700 dark:text-red-200/80' :
              patient.status.toLowerCase() === 'warning' ? 'text-yellow-700 dark:text-yellow-200/80' :
              'text-green-700 dark:text-green-200/80'
            }`}>
              {patient.aiReasoning}
            </p>
          </div>
        </div>
      )}

      {/* ----------------------- CHART ----------------------- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
        <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Heart Rate & SpO₂ Trend
        </h3>
        <VitalsChart vitals={patient.vitals} />
      </div>

      {/* ==========================================================
                    ⭐ HEALTH SUMMARY (LAST 3 DAYS)
         ========================================================== */}
      <div 
        id="health-summary"
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700 space-y-6 scroll-mt-6"
      >
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Health Summary (Last 3 Days)
        </h3>

        {summaryLoading && (
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading summary...</p>
        )}

        {!summaryLoading && summary && (
          <>
            {/* TOP ROW: STATUS + ALERTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Current Status</p>
                <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">{(summary.currentStatus || "unknown").toUpperCase()}</p>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Alerts (Last 3 Days)</p>
                <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">{summary.alertsSummary?.total || 0}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Critical: {summary.alertsSummary?.bySeverity?.critical || 0} • Warning:{" "}
                  {summary.alertsSummary?.bySeverity?.warning || 0}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Time Window</p>
                <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">
                  {summary.timeWindow?.from ? new Date(summary.timeWindow.from).toLocaleDateString() : "N/A"} →{" "}
                  {summary.timeWindow?.to ? new Date(summary.timeWindow.to).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>

            {/* VITALS SUMMARY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* HR */}
              {summary.vitalsSummary.heartRate && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Heart Rate (bpm)</p>
                  <p className="text-lg mt-1 text-slate-900 dark:text-slate-100">Avg: <b>{summary.vitalsSummary.heartRate.avg || 0}</b></p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Min: {summary.vitalsSummary.heartRate.min || 0} • Max:{" "}
                    {summary.vitalsSummary.heartRate.max || 0}
                  </p>
                </div>
              )}

              {/* SpO2 */}
              {summary.vitalsSummary.spo2 && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">SpO₂ (%)</p>
                  <p className="text-lg mt-1 text-slate-900 dark:text-slate-100">Avg: <b>{summary.vitalsSummary.spo2.avg || 0}</b></p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Min: {summary.vitalsSummary.spo2.min || 0} • Max:{" "}
                    {summary.vitalsSummary.spo2.max || 0}
                  </p>
                </div>
              )}

              {/* Temp */}
              {summary.vitalsSummary.temperature && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Temperature (°C)</p>
                  <p className="text-lg mt-1 text-slate-900 dark:text-slate-100">Avg: <b>{summary.vitalsSummary.temperature.avg || 0}</b></p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Min: {summary.vitalsSummary.temperature.min || 0} • Max:{" "}
                    {summary.vitalsSummary.temperature.max || 0}
                  </p>
                </div>
              )}
            </div>

            {/* DOCTOR NOTES SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Doctor Feedback</h4>
                <p className="text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-line">
                  {summary.doctorFeedback?.instructions || "No doctor instructions yet."}
                </p>
                {summary.doctorFeedback?.lastUpdated && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    Last updated:{" "}
                    {new Date(summary.doctorFeedback.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Notes / Observations</h4>
                <p className="text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-line">
                  {summary.doctorFeedback?.notes || "No notes added yet."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ----------------------- ADDITIONAL SECTIONS ----------------------- */}
      {[
        { key: "medicalHistory", title: "Medical History" },
        { key: "notes", title: "Patient Notes" },
        { key: "doctorInstructions", title: "Doctor Instructions" },
      ].map(({ key, title }) => (
        <div
          key={key}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
            <button
              onClick={() => setEditingField(key)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
            >
              Edit
            </button>
            
          </div>
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line text-lg">
            {patient[key] || "No information available."}
          </p>
          
        </div>
      ))}
    </div>
  );
};

export default PatientDetail;
