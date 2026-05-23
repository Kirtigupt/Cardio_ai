import { useState } from "react";
import { X, User, Activity, Phone, MapPin, Home, Hash, Cpu, History } from "lucide-react";

export default function EditPatientModal({ patient, onClose, onSave }) {
  const [form, setForm] = useState({
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    phone: patient.phone || "",
    address: patient.address || "",
    bed: patient.bed,
    ward: patient.ward,
    deviceId: patient.deviceId,
    medicalHistory: patient.medicalHistory || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Edit Patient Profile</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update information for {patient.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="name" value={form.name} onChange={handleChange} className="input-field !pl-10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Age</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="age" type="number" value={form.age} onChange={handleChange} className="input-field !pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Gender</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select name="gender" value={form.gender} onChange={handleChange} className="input-field !pl-10">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="phone" value={form.phone} onChange={handleChange} className="input-field !pl-10" />
                </div>
              </div>
            </div>

            {/* Location & Device */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Hospital Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Ward</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="ward" value={form.ward} onChange={handleChange} className="input-field !pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Bed No.</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="bed" value={form.bed} onChange={handleChange} className="input-field !pl-10" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Device ID</label>
                <div className="relative">
                  <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="deviceId" value={form.deviceId} onChange={handleChange} className="input-field !pl-10 bg-slate-50 dark:bg-slate-950 font-mono text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="address" value={form.address} onChange={handleChange} className="input-field !pl-10" />
                </div>
              </div>
            </div>

            {/* History */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Medical History</label>
              <div className="relative">
                <History className="absolute left-3 top-4 text-slate-400" size={18} />
                <textarea 
                  name="medicalHistory" 
                  value={form.medicalHistory} 
                  onChange={handleChange} 
                  rows="3" 
                  className="input-field !pl-10 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all transform active:scale-95"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
