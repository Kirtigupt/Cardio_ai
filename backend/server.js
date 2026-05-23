import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import Patient from "./src/models/Patient.js";
import { detectAnomalies } from "./src/services/anomalyDetector.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Socket.io connection
io.on("connection", (socket) => {
  console.log("🔌 A user connected to WebSocket");
  
  socket.on("disconnect", () => {
    console.log("🔌 User disconnected");
  });
});

/**
 * REAL-TIME SIMULATION LOOP
 * Every 5 seconds, update all patients with new random vitals
 * and check for anomalies.
 */
setInterval(async () => {
  try {
    const patients = await Patient.find();
    
    for (const patient of patients) {
      // Simulate small fluctuations
      const newVitals = {
        heartRate: Math.floor(Math.random() * (120 - 60 + 1)) + 60, // 60-120 bpm
        spO2: Math.floor(Math.random() * (100 - 92 + 1)) + 92,      // 92-100%
        bloodPressure: `${Math.floor(Math.random() * (140 - 110 + 1)) + 110}/${Math.floor(Math.random() * (90 - 70 + 1)) + 70}`,
        temperature: (Math.random() * (38.5 - 36.5) + 36.5).toFixed(1)
      };

      // Update patient in DB
      const updatedPatient = await Patient.findByIdAndUpdate(
        patient._id,
        { currentVitals: newVitals, lastUpdate: new Date() },
        { new: true }
      );

      // Detect anomalies and create alerts if needed
      const alerts = await detectAnomalies(patient._id, newVitals);

      // Emit the update to all connected clients
      io.emit("vitalsUpdate", updatedPatient);
      
      if (alerts.length > 0) {
        io.emit("newAlert", alerts);
      }
    }
  } catch (err) {
    console.error("Error in simulation loop:", err);
  }
}, 5000);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server is active`);
});