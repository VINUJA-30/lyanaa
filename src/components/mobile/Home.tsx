import { MobileCard, GradientIcon, SectionTitle } from './UI';
import { ShieldCheck, Search, Activity, Bell, Flame, UserCheck } from 'lucide-react';
import { SensorData } from '../../types';

interface HomeProps {
  latestData?: SensorData;
  onNavigate: (screen: string) => void;
}

export default function Home({ latestData, onNavigate }: HomeProps) {
  const isSafe = latestData?.activity !== 'Fall' && !latestData?.is_anomaly;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Care Assistant" subtitle="Your Daily Companion" />
      
      {/* Status Card */}
      <MobileCard className="mb-8 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GradientIcon icon={UserCheck} color="primary" />
            <div>
              <h3 className="font-bold text-lg">{isSafe ? 'All Safe' : 'Attention Needed'}</h3>
              <p className="text-xs text-slate-500">Everything is under control</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isSafe ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isSafe ? 'Normal' : 'Alert'}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-slate-600">Gas Status: <span className="text-emerald-600">Safe</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-medium text-slate-600">Activity: <span className="text-indigo-600">{latestData?.activity || 'Normal'}</span></span>
          </div>
        </div>
      </MobileCard>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <ActionButton 
          icon={Search} 
          label="Find Items" 
          color="bg-indigo-500/10 text-indigo-400" 
          onClick={() => onNavigate('objects')}
        />
        <ActionButton 
          icon={ShieldCheck} 
          label="Safety" 
          color="bg-emerald-500/10 text-emerald-400" 
          onClick={() => onNavigate('safety')}
        />
        <ActionButton 
          icon={Activity} 
          label="Activity" 
          color="bg-blue-500/10 text-blue-400" 
          onClick={() => onNavigate('activity')}
        />
        <ActionButton 
          icon={Bell} 
          label="Alerts" 
          color="bg-rose-500/10 text-rose-400" 
          onClick={() => onNavigate('alerts')}
        />
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white/5 backdrop-blur-md border border-white/10 premium-shadow p-6 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition-all"
    >
      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-bold text-slate-200">{label}</span>
    </button>
  );
}
