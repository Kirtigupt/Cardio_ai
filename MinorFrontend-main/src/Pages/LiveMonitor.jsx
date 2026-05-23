import React, { useEffect, useState } from "react";
import { getPatients } from "../api/api";
import { socket } from "../socket";
import { Activity, Heart, Thermometer, Droplets, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LiveMonitor() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPatients();

    // Listen for real-time vitals updates
    socket.on("vitalsUpdate", (updatedPatient) => {
      setPatients(prev => {
        const newPatients = prev.map(p => p._id === updatedPatient._id ? updatedPatient : p);
        return sortPatients(newPatients);
      });
    });

    return () => {
      socket.off("vitalsUpdate");
    };
  }, []);

  const loadPatients = async () => {
    const p = await getPatients();
    const safePatients = Array.isArray(p?.patients) ? p.patients : Array.isArray(p) ? p : [];
    setPatients(sortPatients(safePatients));
  };

  const sortPatients = (patientList) => {
    const severityOrder = { critical: 1, warning: 2, stable: 3, normal: 3 };
    return [...patientList].sort((a, b) => {
      const aScore = severityOrder[a.status?.toLowerCase()] || 4;
      const bScore = severityOrder[b.status?.toLowerCase()] || 4;
      if (aScore !== bScore) return aScore - bScore;
      return a.name.localeCompare(b.name);
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "critical":
        return "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/40 dark:border-red-600 dark:text-red-300 animate-pulse-fast";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-600 dark:text-yellow-300";
      case "normal":
      case "stable":
        return "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/40 dark:border-green-600 dark:text-green-300";
      default:
        return "bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300";
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Activity className="h-8 w-8 text-blue-600" />
            Live ICU Monitor
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-patient tracking. Critical patients are prioritized.
          </p>
        </div>
        <div className="flex gap-4 items-center">
           <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              Live Connection Active
           </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {patients.map(patient => (
          <div 
            key={patient._id}
            onClick={() => navigate(`/patient/${patient._id}`)}
            className={`cursor-pointer rounded-2xl border-2 p-5 shadow-sm hover:shadow-md transition-all ${getStatusColor(patient.status)}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{patient.name}</h3>
                <p className="text-xs opacity-80">Bed {patient.bed} • {patient.ward}</p>
              </div>
              {patient.status?.toLowerCase() === 'critical' && (
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 animate-bounce" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* HR */}
              <div className="bg-white/50 dark:bg-slate-950/50 rounded-xl p-3 text-center">
                <Heart className="h-5 w-5 mx-auto mb-1 opacity-70" />
                <p className="text-2xl font-bold">{patient.currentVitals?.heartRate || patient.heartRate || '--'}</p>
                <p className="text-[10px] uppercase font-semibold opacity-70">BPM</p>
              </div>
              {/* SpO2 */}
              <div className="bg-white/50 dark:bg-slate-950/50 rounded-xl p-3 text-center">
                <Droplets className="h-5 w-5 mx-auto mb-1 opacity-70" />
                <p className="text-2xl font-bold">{patient.currentVitals?.spO2 || patient.spo2 || '--'}</p>
                <p className="text-[10px] uppercase font-semibold opacity-70">SpO2 %</p>
              </div>
              {/* BP */}
              <div className="bg-white/50 dark:bg-slate-950/50 rounded-xl p-3 text-center col-span-2">
                <Activity className="h-5 w-5 mx-auto mb-1 opacity-70" />
                <p className="text-xl font-bold tracking-wider">{patient.currentVitals?.bloodPressure || patient.bp || '--'}</p>
                <p className="text-[10px] uppercase font-semibold opacity-70">Blood Pressure</p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80 border-t border-black/10 dark:border-white/10 pt-2 block">
                  {patient.status}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
