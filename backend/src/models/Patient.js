import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String },
  phone: { type: String },
  address: { type: String },
  bed: { type: String },
  ward: { type: String },
  deviceId: { type: String, unique: true, required: true },
  status: { type: String, enum: ['Stable', 'Warning', 'Critical'], default: 'Stable' },
  medicalHistory: { type: String },
  currentVitals: {
    heartRate: { type: Number, default: 0 },
    bloodPressure: { type: String, default: "120/80" },
    spO2: { type: Number, default: 98 },
    temperature: { type: Number, default: 37.0 }
  },
  aiReasoning: { type: String, default: 'Patient vitals are within normal ranges. No significant anomalies detected.' },
  lastUpdate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);
