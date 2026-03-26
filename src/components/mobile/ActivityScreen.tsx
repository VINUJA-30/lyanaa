import { MobileCard, SectionTitle, GradientIcon } from './UI';
import { Activity, Footprints, Clock, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import { SensorData } from '../../types';

interface ActivityScreenProps {
  sensorData: SensorData[];
}

export default function ActivityScreen({ sensorData }: ActivityScreenProps) {
  const totalSteps = sensorData.reduce((acc, d) => acc + (d.steps || 0), 0);
  const activeHours = Math.floor(sensorData.length / 12); // Mock: 1 data point per 5 mins
  const activityLevel = Math.min(Math.floor((totalSteps / 5000) * 100), 100);

  const timeline = [
    { time: 'Morning', activity: 'Walking', status: 'Active' },
    { time: 'Afternoon', activity: 'Sitting', status: 'Resting' },
    { time: 'Evening', activity: 'Sleeping', status: 'Sleeping' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Daily Activity" />
      
      {/* Activity Progress */}
      <MobileCard className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Activity Level</h3>
          <span className="text-indigo-600 font-bold text-xl">{activityLevel}%</span>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full gradient-bg transition-all duration-1000 ease-out" 
            style={{ width: `${activityLevel}%` }}
          ></div>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl w-fit">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">No Concerns</span>
        </div>
      </MobileCard>

      {/* Movement Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <MobileCard className="flex flex-col items-center text-center gap-2">
          <GradientIcon icon={Footprints} color="primary" />
          <span className="text-2xl font-bold tracking-tighter">{totalSteps}</span>
          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400">Steps Today</span>
        </MobileCard>
        <MobileCard className="flex flex-col items-center text-center gap-2">
          <GradientIcon icon={Clock} color="secondary" />
          <span className="text-2xl font-bold tracking-tighter">{activeHours}h</span>
          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400">Active Hours</span>
        </MobileCard>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Activity Timeline</h3>
        {timeline.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 relative group">
            {idx !== timeline.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-white/5"></div>
            )}
            <div className="z-10 p-3 bg-white/5 border border-white/10 rounded-2xl premium-shadow text-indigo-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex-1 bg-white/5 p-4 rounded-2xl premium-shadow border border-white/5 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-100 text-sm">{item.time}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{item.activity}</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
