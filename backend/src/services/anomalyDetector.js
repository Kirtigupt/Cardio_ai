import Alert from '../models/Alert.js';
import Patient from '../models/Patient.js';

/**
 * Basic Anomaly Detection Logic
 * In a real-world scenario, this could be replaced with an AI model.
 */
export const detectAnomalies = async (patientId, vitals) => {
  const alerts = [];
  const { heartRate, spO2 } = vitals;

  // 1. Check Heart Rate
  if (heartRate > 100) {
    alerts.push({
      patient: patientId,
      message: `High heart rate detected: ${heartRate} bpm`,
      severity: heartRate > 130 ? 'Critical' : 'Warning',
      vitalType: 'Heart Rate',
      value: heartRate
    });
  } else if (heartRate < 50) {
    alerts.push({
      patient: patientId,
      message: `Low heart rate detected: ${heartRate} bpm`,
      severity: heartRate < 40 ? 'Critical' : 'Warning',
      vitalType: 'Heart Rate',
      value: heartRate
    });
  }

  // 2. Check SpO2
  if (spO2 < 95) {
    alerts.push({
      patient: patientId,
      message: `Low oxygen saturation: ${spO2}%`,
      severity: spO2 < 90 ? 'Critical' : 'Warning',
      vitalType: 'SpO2',
      value: spO2
    });
  }

  // Save alerts and update patient status
  let aiReasoning = "Patient vitals are within normal ranges. No significant anomalies detected.";
  
  if (alerts.length > 0) {
    const highestSeverity = alerts.some(a => a.severity === 'Critical') ? 'Critical' : 'Warning';
    
    // Construct AI Reasoning
    const reasoningParts = alerts.map(a => {
      if (a.vitalType === 'Heart Rate') {
        return a.value > 100 ? `abnormally high heart rate (${a.value} bpm)` : `abnormally low heart rate (${a.value} bpm)`;
      } else if (a.vitalType === 'SpO2') {
        return `dangerously low oxygen saturation (${a.value}%)`;
      }
      return `${a.vitalType} anomaly (${a.value})`;
    });
    
    const reasoningStr = reasoningParts.join(" and ");
    aiReasoning = `The AI classified this patient as ${highestSeverity} due to ${reasoningStr}. Immediate attention is recommended.`;
    
    await Patient.findByIdAndUpdate(patientId, { status: highestSeverity, aiReasoning });
    
    // Create alerts in DB
    for (const alertData of alerts) {
      await Alert.create(alertData);
    }
  } else {
    // If no alerts, ensure status is Stable
    await Patient.findByIdAndUpdate(patientId, { status: 'Stable', aiReasoning });
  }

  return alerts;
};
