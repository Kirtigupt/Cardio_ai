import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['Normal', 'Warning', 'Critical'], required: true },
  vitalType: { type: String }, // e.g., "Heart Rate", "SpO2"
  value: { type: Number },
  isAcknowledged: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Alert', alertSchema);
