import { Alert } from '../types';
import { AlertTriangle, Bell, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface AlertPanelProps {
  alerts: Alert[];
}

export default function AlertPanel({ alerts }: AlertPanelProps) {
  return (
    <div className="bg-white border border-neutral-900 p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h2 className="font-serif italic text-xl font-bold uppercase tracking-tight">Recent Alerts</h2>
        </div>
        {alerts.length > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {alerts.filter(a => a.status === 'active').length}
          </span>
        )}
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-400 opacity-50">
            <CheckCircle className="w-8 h-8 mb-2" />
            <span className="text-[10px] uppercase tracking-widest font-mono">No active alerts</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={cn(
                "border-l-4 p-4 bg-neutral-50 transition-all",
                alert.severity === 'high' ? 'border-red-500 bg-red-50' : 
                alert.severity === 'medium' ? 'border-amber-500 bg-amber-50' : 
                'border-blue-500 bg-blue-50'
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">
                  {alert.type}
                </span>
                <div className="flex items-center gap-1 text-neutral-400">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-mono">
                    {format(new Date(alert.timestamp), 'HH:mm')}
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                {alert.message}
              </p>
              <div className="flex justify-between items-center">
                <span className={cn(
                  "text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded",
                  alert.severity === 'high' ? 'bg-red-100 text-red-700' : 
                  alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 
                  'bg-blue-100 text-blue-700'
                )}>
                  {alert.severity} priority
                </span>
                <button className="text-[8px] uppercase tracking-widest font-bold text-neutral-400 hover:text-neutral-900 transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-100">
        <button className="w-full text-[10px] uppercase tracking-widest font-bold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center justify-center gap-2">
          View All History
        </button>
      </div>
    </div>
  );
}
