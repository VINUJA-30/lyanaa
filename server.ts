import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { MLService } from './src/services/mlService';
import { SensorData, Alert, OperationType } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Firebase for the server
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

  // API Routes
  
  /**
   * POST /api/data
   * Receives sensor data, runs ML, stores in Firestore, returns prediction + alert.
   */
  app.post('/api/data', async (req, res) => {
    try {
      const rawData = req.body;
      const { user_id, timestamp, heart_rate, steps, accel_x, accel_y, accel_z } = rawData;

      if (!user_id || !timestamp) {
        return res.status(400).json({ error: 'Missing required fields: user_id, timestamp' });
      }

      // 1. Run Activity Recognition
      const activity = MLService.recognizeActivity(rawData);

      // 2. Prepare Sensor Data Object
      const sensorData: SensorData = {
        user_id,
        timestamp,
        heart_rate: heart_rate || 70,
        steps: steps || 0,
        accel_x: accel_x || 0,
        accel_y: accel_y || 0,
        accel_z: accel_z || 9.8,
        activity,
        is_anomaly: false
      };

      // 3. Run Anomaly Detection
      const anomalyResult = MLService.detectAnomaly(sensorData);
      sensorData.is_anomaly = anomalyResult.isAnomaly;

      // 4. Store Sensor Data in Firestore
      await addDoc(collection(db, 'sensor_data'), {
        ...sensorData,
        server_timestamp: Timestamp.now()
      });

      // 5. Handle Alerts if Anomaly Detected
      let alert: Alert | null = null;
      if (anomalyResult.isAnomaly && anomalyResult.alertType) {
        alert = {
          user_id,
          timestamp: new Date().toISOString(),
          type: anomalyResult.alertType,
          severity: anomalyResult.severity || 'medium',
          message: anomalyResult.message || 'Anomaly detected.',
          status: 'active'
        };
        await addDoc(collection(db, 'alerts'), {
          ...alert,
          server_timestamp: Timestamp.now()
        });
      }

      res.json({
        status: 'success',
        activity,
        is_anomaly: anomalyResult.isAnomaly,
        alert: alert
      });
    } catch (error) {
      console.error('Error processing sensor data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/report/:user_id
   * Returns daily analytics
   */
  app.get('/api/report/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const q = query(
        collection(db, 'sensor_data'),
        where('user_id', '==', user_id),
        orderBy('server_timestamp', 'desc'),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());

      // Simple Analytics
      const totalSteps = data.reduce((acc, d) => acc + (d.steps || 0), 0);
      const avgHeartRate = data.length > 0 
        ? data.reduce((acc, d) => acc + (d.heart_rate || 0), 0) / data.length 
        : 0;

      res.json({
        user_id,
        summary: {
          total_steps: totalSteps,
          avg_heart_rate: Math.round(avgHeartRate),
          data_points: data.length
        },
        trends: data.slice(0, 20) // Recent trends
      });
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/alerts/:user_id
   * Returns recent alerts
   */
  app.get('/api/alerts/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const q = query(
        collection(db, 'alerts'),
        where('user_id', '==', user_id),
        orderBy('server_timestamp', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      res.json(alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
