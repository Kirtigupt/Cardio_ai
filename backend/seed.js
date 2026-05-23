import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './src/models/Patient.js';

dotenv.config();

const seedPatients = [
  {
    name: "John Doe",
    age: 45,
    gender: "Male",
    deviceId: "DEV-001",
    status: "Stable",
    currentVitals: { heartRate: 72, bloodPressure: "120/80", spO2: 98, temperature: 36.6 }
  },
  {
    name: "Jane Smith",
    age: 62,
    gender: "Female",
    deviceId: "DEV-002",
    status: "Critical",
    currentVitals: { heartRate: 110, bloodPressure: "145/95", spO2: 91, temperature: 38.2 }
  },
  {
    name: "Robert Brown",
    age: 35,
    gender: "Male",
    deviceId: "DEV-003",
    status: "Stable",
    currentVitals: { heartRate: 65, bloodPressure: "115/75", spO2: 99, temperature: 36.8 }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    
    await Patient.deleteMany({});
    console.log("Cleared existing patients.");
    
    await Patient.insertMany(seedPatients);
    console.log("Seeded database with test patients.");
    
    mongoose.connection.close();
    console.log("Done!");
  } catch (err) {
    console.error(err);
  }
};

seedDB();
