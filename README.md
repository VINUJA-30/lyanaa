# ElderGuard AI - Production-Ready Elderly Monitoring Platform

## 🎯 System Overview
ElderGuard AI is a full-stack platform designed to monitor elderly safety and health in real-time. It processes sensor data from smartwatches to recognize activities, detect anomalies (like falls or irregular heart rates), and alert caregivers.

## 🚀 Features
- **Real-time Activity Recognition:** Walking, Sitting, Sleeping, Fall.
- **Anomaly Detection:** High heart rate, sudden impacts, and behavioral changes.
- **Caregiver Dashboard:** Live status, health trends (heart rate & steps), and alert history.
- **Secure Data Storage:** Firestore with robust security rules.
- **AI-Powered Predictions:** Mobility decline risk analysis.

## 🛠️ Tech Stack
- **Frontend:** React 19, Tailwind CSS, Recharts, Lucide React.
- **Backend:** Node.js (Express), Vite Middleware.
- **Database:** Firebase Firestore.
- **Authentication:** Firebase Google Auth.
- **ML Logic:** Custom TypeScript-based inference engine.

## 📁 Folder Structure
- `/server.ts`: Express backend entry point.
- `/src/App.tsx`: Main frontend layout and auth.
- `/src/components/`: UI components (Dashboard, Charts, Alerts).
- `/src/services/mlService.ts`: ML inference and anomaly detection logic.
- `/src/firebase.ts`: Firebase initialization.
- `/src/types.ts`: Shared TypeScript interfaces.
- `/firestore.rules`: Security rules for data protection.
- `/firebase-blueprint.json`: Data schema definition.

## 📥 Smartwatch API Integration
The system accepts data via `POST /api/data`:
```json
{
  "user_id": "E001",
  "timestamp": "2026-03-26T10:30:00",
  "heart_rate": 78,
  "steps": 120,
  "accel_x": 0.2,
  "accel_y": 0.5,
  "accel_z": 9.1
}
```

## ⚙️ Running the System
1. **Install Dependencies:** `npm install`
2. **Start Development Server:** `npm run dev`
3. **Build for Production:** `npm run build`
4. **Start Production Server:** `npm start`

## 🚨 Alert System
Alerts are triggered automatically when:
- A fall is detected via accelerometer data.
- Heart rate exceeds 120 BPM or falls below 40 BPM.
- Anomalous behavior is detected by the ML engine.
