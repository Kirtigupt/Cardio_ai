import React, { useState } from "react";
import { createPatient } from "../api/api";
import { 
  User, 
  Phone, 
  MapPin, 
  Stethoscope, 
  Activity, 
  Thermometer, 
  Droplets, 
  ClipboardList, 
  PlusCircle, 
  ArrowLeft,
  Hash,
  Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    bed: "",
    ward: "",
    deviceId: "",
    heartRate: "",
    bloodPressure: "",
    spo2: "",
    temperature: "",
    medicalHistory: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // Structure data for the backend as per the Mongoose model
      const patientData = {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        bed: formData.bed,
        ward: formData.ward,
        deviceId: formData.deviceId,
        medicalHistory: formData.medicalHistory,
        currentVitals: {
          heartRate: Number(formData.heartRate) || 0,
          bloodPressure: formData.bloodPressure || "120/80",
          spO2: Number(formData.spo2) || 98,
          temperature: Number(formData.temperature) || 37.0,
        },
      };

      await createPatient(patientData);

      setSuccessMsg("Patient added successfully! Redirecting...");
      
      // Clear form
      setFormData({
        name: "", age: "", gender: "", phone: "", address: "",
        bed: "", ward: "", deviceId: "", heartRate: "",
        bloodPressure: "", spo2: "", temperature: "", medicalHistory: "",
      });

      // Redirect after a short delay
      setTimeout(() => navigate("/patients"), 2000);

    } catch (error) {
      console.error("SERVER ERROR:", error.response?.data || error);
      setErrorMsg(
        error.response?.data?.message || 
        "Failed to add patient. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Registry</span>
          </button>
          
          <div className="text-right">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 justify-end">
              <PlusCircle className="text-blue-600" size={32} />
              Register New Patient
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Enroll a new patient into the monitoring system</p>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <div className="bg-green-500 text-white p-1 rounded-full">
              <PlusCircle size={16} />
            </div>
            {successMsg}
          </div>
        )}
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <div className="bg-red-500 text-white p-1 rounded-full">
              <ClipboardList size={16} />
            </div>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAddPatient} className="space-y-8">
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Personal & Contact */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Section: Personal Info */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                  <User size={20} className="text-blue-500" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field !pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Age</label>
                      <div className="relative">
                        <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          name="age"
                          type="number"
                          placeholder="30"
                          value={formData.age}
                          onChange={handleChange}
                          required
                          className="input-field !pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Gender</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          className="input-field !pl-10"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+1 234 567 890"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-field !pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        name="address"
                        type="text"
                        placeholder="123 Medical St, City"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="input-field !pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Medical Info */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                  <Stethoscope size={20} className="text-emerald-500" />
                  Medical & Location Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Ward Assignment</label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        required
                        className="input-field !pl-10"
                      >
                        <option value="">Select Ward</option>
                        <option value="ICU">ICU</option>
                        <option value="Emergency">Emergency</option>
                        <option value="General Ward">General Ward</option>
                        <option value="CCU">CCU</option>
                        <option value="NICU">NICU</option>
                        <option value="Private Room">Private Room</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Bed No.</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          name="bed"
                          type="text"
                          placeholder="B-101"
                          value={formData.bed}
                          onChange={handleChange}
                          required
                          className="input-field !pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Device ID</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          name="deviceId"
                          type="text"
                          placeholder="D-99"
                          value={formData.deviceId}
                          onChange={handleChange}
                          required
                          className="input-field !pl-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Medical History / Notes</label>
                  <textarea
                    name="medicalHistory"
                    placeholder="Describe any chronic conditions, allergies, or recent surgeries..."
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows="4"
                    className="input-field resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column: Vitals (Sticky) */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl text-white sticky top-8">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Activity size={20} />
                  Initial Vital Signs
                </h3>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-blue-100 opacity-80">Heart Rate (BPM)</label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                      <input
                        name="heartRate"
                        type="number"
                        placeholder="72"
                        value={formData.heartRate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-blue-200/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-blue-100 opacity-80">Blood Pressure</label>
                    <div className="relative">
                      <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                      <input
                        name="bloodPressure"
                        type="text"
                        placeholder="120/80"
                        value={formData.bloodPressure}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-blue-200/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-wider text-blue-100 opacity-80">SpO₂ (%)</label>
                      <input
                        name="spo2"
                        type="number"
                        placeholder="98"
                        value={formData.spo2}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-blue-200/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-wider text-blue-100 opacity-80">Temp (°C)</label>
                      <div className="relative">
                        <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                        <input
                          name="temperature"
                          type="number"
                          step="0.1"
                          placeholder="36.5"
                          value={formData.temperature}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-blue-200/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 bg-white text-blue-700 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={20} />
                      Add Patient
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
