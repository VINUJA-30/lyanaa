import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function MobileCard({ children, className, glass = false }: { children: ReactNode, className?: string, glass?: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl p-5",
      glass ? "glass-card" : "bg-white/5 backdrop-blur-md border border-white/10 premium-shadow",
      className
    )}>
      {children}
    </div>
  );
}

export function GradientButton({ children, onClick, className, icon: Icon }: { children: ReactNode, onClick?: () => void, className?: string, icon?: any }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "gradient-bg text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-200 active:scale-95 transition-all",
        className
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}

export function GradientIcon({ icon: Icon, color = 'primary', className }: { icon: any, color?: 'primary' | 'secondary' | 'success' | 'danger', className?: string }) {
  const colors = {
    primary: 'bg-indigo-50 text-indigo-600',
    secondary: 'bg-blue-50 text-blue-600',
    success: 'bg-emerald-50 text-emerald-600',
    danger: 'bg-rose-50 text-rose-600'
  };

  return (
    <div className={cn("p-3 rounded-2xl flex items-center justify-center", colors[color], className)}>
      <Icon className="w-6 h-6" />
    </div>
  );
}

export function SectionTitle({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
