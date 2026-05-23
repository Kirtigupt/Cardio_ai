import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import Patient from "./models/Patient.js"
import Alert from "./models/Alert.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Router
const apiRouter = express.Router()

// Auth routes (Keep mock for now, or expand if needed)
apiRouter.post('/auth/login', (req, res) => {
    res.json({ 
        user: { 
            name: "Test User", 
            email: req.body.email,
            token: "mock-token"
        } 
    })
})

apiRouter.post('/auth/register', (req, res) => {
    res.json({ message: "User registered" })
})

// Patient routes
apiRouter.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

apiRouter.post('/patients', async (req, res) => {
    try {
        const patient = new Patient(req.body);
        const savedPatient = await patient.save();
        res.status(201).json(savedPatient);
    } catch (error) {
        console.error("Error creating patient:", error);
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "A patient with this Device ID already exists. Each patient must have a unique device." 
            });
        }
        res.status(400).json({ message: error.message });
    }
})

apiRouter.put('/patients/:id', async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );
        if (!updatedPatient) return res.status(404).json({ message: "Patient not found" });
        res.json({ message: "Patient updated successfully", updatedPatient });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

apiRouter.delete('/patients/:id', async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        if (!deletedPatient) return res.status(404).json({ message: "Patient not found" });
        res.json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

apiRouter.get('/patients/:id/summary', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        
        // In a real app, we'd fetch actual historical data.
        // For now, we'll return a structured mock that matches the frontend's expectations.
        const summary = {
            currentStatus: patient.status || "Stable",
            alertsSummary: {
                total: 5,
                bySeverity: {
                    critical: 1,
                    warning: 4
                }
            },
            timeWindow: {
                from: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                to: new Date().toISOString()
            },
            vitalsSummary: {
                heartRate: {
                    avg: 78,
                    min: 65,
                    max: 92
                },
                spo2: {
                    avg: 97,
                    min: 94,
                    max: 99
                },
                temperature: {
                    avg: 36.8,
                    min: 36.4,
                    max: 37.2
                }
            },
            doctorFeedback: {
                instructions: "Patient is recovering well. Maintain current medication dosage. Monitor hydration levels closely.",
                notes: "No significant complications observed in the last 72 hours. Vital trends are within acceptable ranges.",
                lastUpdated: new Date().toISOString()
            }
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

apiRouter.get('/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        res.json(patient);
    } catch (error) {
        res.status(404).json({ message: "Patient not found" });
    }
})

// Alert routes
apiRouter.get('/alerts', async (req, res) => {
    try {
        const alerts = await Alert.find().populate('patient').sort({ createdAt: -1 }).limit(50);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

apiRouter.post('/alerts/:id/ack', async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(req.params.id, { isAcknowledged: true }, { new: true });
        res.json(alert);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// AI Summary route
apiRouter.get('/ai-summary', async (req, res) => {
    try {
        const totalPatients = await Patient.countDocuments();
        const criticalPatients = await Patient.countDocuments({ status: 'Critical' });
        const activeAlerts = await Alert.countDocuments({ isAcknowledged: false });

        res.json({
            summary: `Currently monitoring ${totalPatients} patients. ${criticalPatients} patients require immediate attention. There are ${activeAlerts} unacknowledged alerts in the system.`,
            criticalCount: criticalPatients,
            alertCount: activeAlerts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Apply the prefix
app.use('/api', apiRouter)

export default app