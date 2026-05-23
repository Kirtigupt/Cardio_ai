import { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const AlertContext = createContext();

let alertAudio = new Audio("/sounds/alert.mp3");
alertAudio.load();

export default function GlobalAlertProvider({ children }) {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("new-alert", (alert) => {
      console.log("GLOBAL ALERT RECEIVED:", alert);

      // Play sound AFTER UI paint — perfect sync
      requestAnimationFrame(() => {
        alertAudio.currentTime = 0;
        alertAudio.play().catch(() => {});
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <AlertContext.Provider value={{}}>
      {children}
    </AlertContext.Provider>
  );
}
