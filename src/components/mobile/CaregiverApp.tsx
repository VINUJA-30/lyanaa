import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { SensorData, Alert, UserProfile } from '../../types';
import { Home as HomeIcon, Search, ShieldCheck, Activity, Bell, User as UserIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

// Screens
import Home from './Home';
import FindItems from './FindItems';
import SafetyMonitor from './SafetyMonitor';
import ActivityScreen from './ActivityScreen';
import Notifications from './Notifications';

interface CaregiverAppProps {
  user: User;
  profile: UserProfile;
}

export default function CaregiverApp({ user, profile }: CaregiverAppProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for recent sensor data
    const qData = query(
      collection(db, 'sensor_data'),
      where('user_id', '==', 'E001'),
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

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <Home latestData={sensorData[0]} onNavigate={setActiveTab} />;
      case 'objects': return <FindItems />;
      case 'safety': return <SafetyMonitor />;
      case 'activity': return <ActivityScreen sensorData={sensorData} />;
      case 'alerts': return <Notifications alerts={alerts} onClearAll={() => {}} />;
      default: return <Home latestData={sensorData[0]} onNavigate={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'objects', icon: Search, label: 'Objects' },
    { id: 'safety', icon: ShieldCheck, label: 'Safety' },
    { id: 'activity', icon: Activity, label: 'Activity' },
    { id: 'alerts', icon: Bell, label: 'Alerts' }
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col relative overflow-hidden">
      {/* Header (Optional, can be screen-specific) */}
      <div className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-bg rounded-xl flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-white tracking-tight">ElderGuard</span>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 premium-shadow flex items-center justify-center text-slate-400">
          <UserIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pb-32 overflow-y-auto custom-scrollbar">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto nav-blur px-6 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              activeTab === item.id ? "text-indigo-600 scale-110" : "text-slate-400"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              activeTab === item.id ? "gradient-bg text-white shadow-lg shadow-indigo-200" : ""
            )}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className={cn(
              "text-[8px] font-bold uppercase tracking-widest",
              activeTab === item.id ? "opacity-100" : "opacity-0"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
