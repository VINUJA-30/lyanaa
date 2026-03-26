import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SensorData } from '../types';
import { format } from 'date-fns';

interface HealthChartsProps {
  data: SensorData[];
}

export default function HealthCharts({ data }: HealthChartsProps) {
  // Process data for charts
  const chartData = data.slice().reverse().map(d => ({
    time: format(new Date(d.timestamp), 'HH:mm'),
    heartRate: d.heart_rate,
    steps: d.steps
  }));

  return (
    <div className="space-y-12">
      {/* Heart Rate Chart */}
      <div className="h-[250px] w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Heart Rate (BPM)</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#999' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#999' }}
              domain={[40, 160]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #141414', 
                borderRadius: '0px',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="heartRate" 
              stroke="#ef4444" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorHr)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Steps Chart */}
      <div className="h-[250px] w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Activity (Steps)</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#999' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#999' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #141414', 
                borderRadius: '0px',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }} 
            />
            <Area 
              type="stepAfter" 
              dataKey="steps" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorSteps)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
