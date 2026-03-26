import { MobileCard, SectionTitle, GradientButton } from './UI';
import { Camera, MapPin, Clock, Search } from 'lucide-react';

export default function FindItems() {
  const recentItems = [
    { name: 'Keys', location: 'Living Room', time: '10:30 AM', status: 'Found' },
    { name: 'Glasses', location: 'Bedroom', time: '09:15 AM', status: 'Found' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Find My Items" />
      
      {/* Camera Preview Card */}
      <MobileCard className="mb-8 p-0 overflow-hidden relative group">
        <div className="aspect-video bg-slate-900 flex items-center justify-center">
          <Camera className="w-12 h-12 text-slate-700 group-hover:scale-110 transition-transform" />
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live View</span>
          </div>
        </div>
        <div className="p-6">
          <GradientButton icon={Search} className="w-full">
            Scan for Items
          </GradientButton>
        </div>
      </MobileCard>

      {/* Recent Items */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Recent Items</h3>
        {recentItems.map((item, idx) => (
          <MobileCard key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100">{item.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.location} • {item.time}</span>
                </div>
              </div>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {item.status}
            </span>
          </MobileCard>
        ))}
      </div>
    </div>
  );
}
