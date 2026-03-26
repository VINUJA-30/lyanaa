import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { SensorData, Alert, UserProfile } from '../types';
import { Activity, Heart, Footprints, AlertTriangle, TrendingUp, RefreshCw, Zap } from 'lucide-react';
import { format } from 'date-fns';
import HealthCharts from './HealthCharts';
import AlertPanel from './AlertPanel';
import LiveActivity from './LiveActivity';

interface DashboardProps {
  user: User;
  profile: UserProfile;
}

export default function Dashboard({ user, profile }: DashboardProps) {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    // Listen for recent sensor data
    const qData = query(
      collection(db, 'sensor_data'),
      where('user_id', '==', 'E001'), // Demo user ID
      orderBy('server_timestamp', 'desc'),
      limit(50)
    );
    const unsubscribeData = onSnapshot(qData, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SensorData));
      setSensorData(data);
      setLoading(false);
    });

    // Listen for alerts
    const qAlerts = query(
      collection(db, 'alerts'),
      where('user_id', '==', 'E001'),
      orderBy('server_timestamp', 'desc'),
      limit(10)
    );
    const unsubscribeAlerts = onSnapshot(qAlerts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
      setAlerts(data);
    });

    return () => {
      unsubscribeData();
      unsubscribeAlerts();
    };
  }, []);

  const simulateData = async () => {
    setSimulating(true);
    try {
      const activities = ['Walking', 'Sitting', 'Sleeping', 'Fall'];
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      
      const payload = {
        user_id: 'E001',
        timestamp: new Date().toISOString(),
        heart_rate: randomActivity === 'Fall' ? 130 : Math.floor(Math.random() * 40) + 60,
        steps: randomActivity === 'Walking' ? Math.floor(Math.random() * 50) + 10 : 0,
        accel_x: Math.random() * 2 - 1,
        accel_y: Math.random() * 2 - 1,
        accel_z: randomActivity === 'Fall' ? 20 : 9.8 + (Math.random() * 2 - 1)
      };

      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed to simulate data');
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setTimeout(() => setSimulating(false), 500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const latestData = sensorData[0];

  return (
    <div className="space-y-8">
      {/* Top Section: Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <LiveActivity data={latestData} />
        </div>
        
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            title="Heart Rate" 
            value={latestData?.heart_rate || '--'} 
            unit="BPM" 
            icon={<Heart className="w-5 h-5 text-red-500" />}
            status={latestData?.heart_rate > 100 ? 'warning' : 'normal'}
          />
          <StatCard 
            title="Daily Steps" 
            value={sensorData.reduce((acc, d) => acc + (d.steps || 0), 0)} 
            unit="Steps" 
            icon={<Footprints className="w-5 h-5 text-blue-500" />}
          />
          <StatCard 
            title="Mobility Risk" 
            value="LOW" 
            unit="Stable" 
            icon={<TrendingUp className="w-5 h-5 text-green-500" />}
            status="normal"
          />
        </div>
      </div>

      {/* Middle Section: Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-neutral-900 p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif italic text-xl font-bold uppercase tracking-tight">Health Trends</h2>
            <div className="flex gap-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-400">Last 24 Hours</span>
            </div>
          </div>
          <HealthCharts data={sensorData} />
        </div>

        <div className="lg:col-span-1">
          <AlertPanel alerts={alerts} />
        </div>
      </div>

      {/* Bottom Section: Simulation Control */}
      <div className="flex justify-center pt-8 border-t border-neutral-300">
        <button
          onClick={simulateData}
          disabled={simulating}
          className="flex items-center gap-2 bg-white border border-neutral-900 px-6 py-3 font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-50"
        >
          <Zap className={simulating ? 'animate-pulse' : ''} />
          {simulating ? 'Processing...' : 'Simulate Smartwatch Data'}
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, icon, status = 'normal' }: { title: string, value: any, unit: string, icon: any, status?: 'normal' | 'warning' | 'danger' }) {
  const statusColors = {
    normal: 'border-neutral-900',
    warning: 'border-amber-500 bg-amber-50',
    danger: 'border-red-500 bg-red-50'
  };

  return (
    <div className={`bg-white border p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] ${statusColors[status]}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold font-mono tracking-tighter">{value}</span>
        <span className="text-[10px] uppercase tracking-widest font-mono opacity-50">{unit}</span>
      </div>
    </div>
  );
}
