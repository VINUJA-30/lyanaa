import { SensorData } from '../types';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface LiveActivityProps {
  data: SensorData;
}

export default function LiveActivity({ data }: LiveActivityProps) {
  const activityColors = {
    Walking: 'bg-blue-500 text-white',
    Sitting: 'bg-neutral-200 text-neutral-900',
    Sleeping: 'bg-indigo-900 text-white',
    Fall: 'bg-red-600 text-white animate-pulse'
  };

  const activityIcons = {
    Walking: <Activity className="w-6 h-6" />,
    Sitting: <Activity className="w-6 h-6 opacity-50" />,
    Sleeping: <Activity className="w-6 h-6 opacity-30" />,
    Fall: <AlertCircle className="w-6 h-6" />
  };

  return (
    <div className="bg-white border border-neutral-900 p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Live State</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-green-600">Connected</span>
          </div>
        </div>
        
        <div className={cn(
          "aspect-square rounded-full flex flex-col items-center justify-center gap-2 border-4 border-neutral-900 transition-all duration-500",
          activityColors[data?.activity || 'Sitting']
        )}>
          {activityIcons[data?.activity || 'Sitting']}
          <span className="text-xl font-serif italic font-bold uppercase tracking-tight">
            {data?.activity || 'Idle'}
          </span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-100">
        <div className="flex items-center gap-2 text-neutral-500">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-widest font-mono">AI Monitoring Active</span>
        </div>
      </div>
    </div>
  );
}
