import { MobileCard, SectionTitle, GradientIcon } from './UI';
import { Bell, Search, Activity, ShieldCheck, Trash2, Clock } from 'lucide-react';
import { Alert } from '../../types';
import { format } from 'date-fns';

interface NotificationsProps {
  alerts: Alert[];
  onClearAll: () => void;
}

export default function Notifications({ alerts, onClearAll }: NotificationsProps) {
  const notifications = [
    { type: 'Item Found', message: 'Keys found in Living Room', time: '10:30 AM', icon: Search, color: 'primary' },
    { type: 'Activity Update', message: 'Daily step goal reached!', time: '09:45 AM', icon: Activity, color: 'secondary' },
    { type: 'Safety Check', message: 'System self-check completed', time: '08:00 AM', icon: ShieldCheck, color: 'success' },
    ...alerts.map(a => ({
      type: a.type,
      message: a.message,
      time: format(new Date(a.timestamp), 'HH:mm'),
      icon: Bell,
      color: a.severity === 'high' ? 'danger' : 'secondary'
    }))
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <SectionTitle title="Notifications" />
        <button 
          onClick={onClearAll}
          className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-700">
            <Bell className="w-12 h-12 mb-4 opacity-10" />
            <span className="text-sm font-bold uppercase tracking-widest">All caught up!</span>
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <MobileCard key={idx} className="flex items-start gap-4 hover:bg-white/5 transition-colors group">
              <GradientIcon icon={notif.icon} color={notif.color as any} className="group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-100 text-sm">{notif.type}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    <span>{notif.time}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </MobileCard>
          ))
        )}
      </div>
    </div>
  );
}
