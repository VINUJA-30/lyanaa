import { MobileCard, SectionTitle, GradientButton, GradientIcon } from './UI';
import { Flame, ShieldCheck, PhoneCall, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SafetyMonitor() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Safety Monitor" />
      
      {/* Gas Status Card */}
      <MobileCard className="mb-8 border-l-4 border-emerald-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <GradientIcon icon={Flame} color="success" />
            <div>
              <h3 className="font-bold text-lg text-white">Gas Status</h3>
              <p className="text-xs text-slate-500">Kitchen Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-widest">Safe</span>
          </div>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-center gap-2 text-slate-500">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-widest font-mono">No leaks detected</span>
        </div>
      </MobileCard>

      {/* Emergency Card */}
      <MobileCard className="bg-rose-500/5 border border-rose-500/10 p-8 flex flex-col items-center text-center shadow-rose-900/20">
        <div className="p-6 bg-white/10 rounded-full mb-6 shadow-xl shadow-rose-500/20">
          <AlertTriangle className="w-12 h-12 text-rose-500 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold text-rose-100 mb-2 tracking-tight">Emergency Help</h3>
        <p className="text-rose-400/70 text-sm mb-8 leading-relaxed">
          Need immediate assistance? Click below to call emergency services or primary caregiver.
        </p>
        <button className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-rose-500/20 active:scale-95 transition-all text-lg uppercase tracking-widest">
          <PhoneCall className="w-6 h-6" />
          Call Help
        </button>
      </MobileCard>

      {/* Safety Logs */}
      <div className="mt-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Safety Checks</h3>
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl premium-shadow border border-white/5">
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">System Self-Check</h4>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-mono">Completed at 10:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
