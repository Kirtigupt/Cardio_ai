// src/api/api.js

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';


const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // after login you must save token
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

// Request interceptor: attach token automatically
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

// Response interceptor: handle 401 automatically
axiosInstance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // optional: redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
/* AUTH */
export const loginUser = (data) =>
  axiosInstance.post("/auth/login", data).then((r) => r.data);

export const registerUser = (data) =>
  axiosInstance.post('/auth/register', data).then(r => r.data);

export const getProfile = () =>
  axiosInstance.get('/auth/profile').then(r => r.data);


/* PATIENTS */
export const getPatients = (params = {}) =>
  axiosInstance.get('/patients', { params }).then(r => r.data);

export const createPatient = (patientObj) =>
  axiosInstance.post('/patients', patientObj).then(r => r.data);

export const getPatientById = (id) =>
  axiosInstance.get(`/patients/${id}`).then(r => r.data);

export const postVitals = (patientId, vitalsObj) =>
  axiosInstance.post(`/patients/${patientId}/vitals`, vitalsObj).then(r => r.data);

export const postVitalsByDevice = (deviceId, vitalsObj) =>
  axiosInstance.post(`/patients/device/${deviceId}/vitals`, vitalsObj).then(r => r.data);

/* ALERTS */
export const getAlerts = () => axiosInstance.get('/alerts').then(r => r.data);
export const acknowledgeAlert = (alertId) => axiosInstance.post(`/alerts/${alertId}/ack`).then(r => r.data);

export const deletePatient = (id) =>
  axiosInstance.delete(`/patients/${id}`).then((r) => r.data);

/* SETTINGS */
export const getSettings = () =>
  axiosInstance.get("/settings").then((r) => r.data);

export const updateSettings = (payload) =>
  axiosInstance.put("/settings", payload).then((r) => r.data);

export const deleteAlert = (id) =>
  axiosInstance.delete(`/alerts/${id}`).then((r) => r.data);

export const deleteAllAlerts = () =>
  axiosInstance.delete(`/alerts`).then((r) => r.data);


export const getAISummary = () =>
  axiosInstance.get("/ai-summary").then(r => r.data);

export const updatePatient = (id, data) =>
  axiosInstance.put(`/patients/${id}`, data).then((r) => r.data);

// Get summary for a single patient
export const getPatientSummary = (id) =>
  axiosInstance.get(`/patients/${id}/summary`).then(r => r.data);


export default axiosInstance;
