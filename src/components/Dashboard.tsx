import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { AnalysisResult } from '../types';
import { format, parseISO } from 'date-fns';
import { Clock, BarChart3, MessageSquare } from 'lucide-react';

interface DashboardProps {
  history: AnalysisResult[];
}

export const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface border border-border rounded-2xl">
        <BarChart3 className="w-12 h-12 text-zinc-600 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-400">No progress data yet</h3>
        <p className="text-sm text-zinc-500 mt-2">Complete your first speaking session to see analytics.</p>
      </div>
    );
  }

  const chartData = history.slice(-7).map(item => ({
    date: format(parseISO(item.timestamp), 'MMM dd'),
    fluency: item.fluencyScore,
    confidence: item.confidenceScore,
    fillers: item.totalFillerCount,
  }));

  const totalSpeakingTime = history.reduce((acc, curr) => acc + curr.durationSeconds, 0);
  const avgFluency = (history.reduce((acc, curr) => acc + curr.fluencyScore, 0) / history.length).toFixed(1);
  
  // Find most common filler word
  const fillerCounts: Record<string, number> = {};
  history.forEach(item => {
    item.fillerWords.forEach(fw => {
      fillerCounts[fw.word] = (fillerCounts[fw.word] || 0) + fw.count;
    });
  });
  const mostCommonFiller = Object.entries(fillerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Total Speaking Time" 
          value={`${Math.floor(totalSpeakingTime / 60)}m ${totalSpeakingTime % 60}s`}
          icon={<Clock className="w-4 h-4 text-blue-400" />}
        />
        <StatCard 
          label="Avg. Fluency Score" 
          value={`${avgFluency}/10`}
          icon={<BarChart3 className="w-4 h-4 text-accent" />}
        />
        <StatCard 
          label="Top Filler Word" 
          value={mostCommonFiller}
          icon={<MessageSquare className="w-4 h-4 text-purple-400" />}
        />
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6">Skill Growth (Last 7 Sessions)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorFluency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#525252" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#525252" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={[0, 10]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="fluency" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorFluency)" 
                strokeWidth={2}
                name="Fluency"
              />
              <Area 
                type="monotone" 
                dataKey="confidence" 
                stroke="#3B82F6" 
                fillOpacity={0} 
                strokeWidth={2}
                name="Confidence"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="bg-surface border border-border rounded-xl p-6">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{label}</span>
    </div>
    <div className="text-2xl font-mono font-bold text-white">{value}</div>
  </div>
);
