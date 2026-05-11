import React from 'react';
import { AnalysisResult } from '../types';
import { format, parseISO } from 'date-fns';
import { History, ChevronRight, Calendar, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryViewProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  onClear: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface border border-border rounded-2xl">
        <History className="w-12 h-12 text-zinc-600 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-400">No history yet</h3>
        <p className="text-sm text-zinc-500 mt-2">Your analyzed sessions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-accent" />
          Practice History
        </h2>
        <button 
          onClick={() => {
            if (confirm('Are you sure you want to clear all history?')) onClear();
          }}
          className="text-[10px] font-medium text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div className="space-y-3">
        {history.map((item, index) => (
          <motion.button
            key={item.timestamp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(item)}
            className="w-full bg-surface border border-border hover:border-accent/50 p-4 rounded-xl flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-zinc-900 flex flex-col items-center justify-center border border-border group-hover:bg-accent/10 group-hover:border-accent/30 transition-colors">
                <span className="text-lg font-mono font-bold text-accent">{item.fluencyScore}</span>
                <span className="text-[8px] text-zinc-500 uppercase font-bold">Score</span>
              </div>
              
              <div className="text-left">
                <div className="text-sm font-medium text-zinc-100 line-clamp-1 max-w-[200px]">
                  {item.transcript}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                    <Calendar className="w-3 h-3" />
                    {format(parseISO(item.timestamp), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                    <Clock className="w-3 h-3" />
                    {Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s
                  </div>
                </div>
              </div>
            </div>
            
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-accent transition-colors" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
