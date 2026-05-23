import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './src/models/Patient.js';

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");
    
    // Check if we can add a patient
    const testPatient = new Patient({
      name: "Test Patient",
      age: 30,
      deviceId: "TEST_DEVICE_" + Date.now(),
      phone: "1234567890",
      address: "Test Address",
      bed: "B1",
      ward: "General",
      currentVitals: {
        heartRate: 75,
        bloodPressure: "120/80",
        spO2: 98,
        temperature: 37.0
      }
    });
    
    const saved = await testPatient.save();
    console.log("Saved patient:", saved._id);
    
    // Clean up
    await Patient.findByIdAndDelete(saved._id);
    console.log("Deleted test patient");
    
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

test();
