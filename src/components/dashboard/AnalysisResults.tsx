import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  ChevronLeft, 
  Play, 
  Pause,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles,
  Timer,
  Heart,
  Target,
  Search,
  Bell,
  User,
  Trash2
} from 'lucide-react';
import { PracticeSession } from '../../types/communication';
import WaveSurfer from 'wavesurfer.js';

interface AnalysisResultsProps {
  result: PracticeSession;
  onBack: () => void;
  onDelete: () => void;
}

const MetricCard = ({ label, value, score, feedback }: { label: string; value: string | number; score: number; feedback: string }) => (
  <div className="p-10 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-6 relative overflow-hidden group">
    <div className="flex justify-between items-start">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
    </div>
    <div className="space-y-4">
      <h4 className="text-5xl font-bold text-white tracking-tighter">{value}</h4>
      <p className="text-sm text-zinc-500 leading-relaxed italic pr-4">
        {feedback}
      </p>
    </div>
  </div>
);

export function AnalysisResults({ result, onBack, onDelete }: AnalysisResultsProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (waveformRef.current && result.audioUrl) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#27272a',
        progressColor: '#10b981',
        cursorColor: '#10b981',
        barWidth: 2,
        barRadius: 3,
        height: 60,
        gap: 2
      });
      wavesurfer.current.load(result.audioUrl);
      wavesurfer.current.on('play', () => setIsPlaying(true));
      wavesurfer.current.on('pause', () => setIsPlaying(false));
      wavesurfer.current.on('finish', () => setIsPlaying(false));
      return () => wavesurfer.current?.destroy();
    }
  }, [result.audioUrl]);

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-24">
      {/* Top Navigation Bar - Matching Screenshot */}
      <div className="flex items-center justify-between px-10 py-4 border-b border-white/5 bg-zinc-950 sticky top-0 z-30">
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <span>Platform</span>
          <span className="text-zinc-800">/</span>
          <span className="text-zinc-200 italic">System</span>
        </div>
        
        <div className="flex-1 max-w-sm mx-10 relative group">
          <div className="absolute inset-y-0 left-4 flex items-center text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search sessions or metrics..." 
            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2 pl-12 pr-10 text-xs font-medium focus:outline-none focus:border-emerald-500/50 transition-all"
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <span className="px-1.5 py-0.5 rounded-md border border-white/10 text-[10px] text-zinc-600 font-bold">⌘ K</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Bell className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-zinc-950" />
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right">
              <p className="text-[10px] font-bold text-white leading-none">Engineering Track</p>
              <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Status: Active</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-10 pt-10">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-zinc-600 hover:text-emerald-400 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Archive
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-12 pb-24 px-10">
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4 flex-1">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight italic">
              {result.topic?.text ? `Regarding "${result.topic.text.slice(0, 60)}..."` : "Practice Session"}
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl italic">
              "{result.conversationalFeedback.summary}"
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-8 rounded-[3rem] bg-emerald-500 text-emerald-950 shadow-2xl shadow-emerald-500/20">
             <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-2 leading-none">Fluency</span>
             <span className="text-6xl font-bold leading-none tracking-tighter tabular-nums">{result.overallScore}</span>
             <span className="text-sm font-bold opacity-60 mt-2">%</span>
          </div>
        </div>

        {/* Audio Player Card - Matching Screenshot */}
        <div className="p-8 rounded-[2.5rem] bg-zinc-900 border-l-[3px] border-emerald-500/50 bg-gradient-to-r from-emerald-500/5 to-transparent space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
                <button 
                  onClick={() => wavesurfer.current?.playPause()}
                  className="w-16 h-16 rounded-[1.2rem] bg-emerald-500 text-emerald-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/30"
                >
                  {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                </button>
                <div>
                  <h3 className="font-bold text-xl text-white">Listening replay</h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1 opacity-60">Captured at {new Date(result.timestamp).toLocaleTimeString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 font-bold">
                <Clock className="w-4 h-4" />
                <span className="text-sm tracking-tight">{Math.floor(result.durationSeconds / 60)}:{(result.durationSeconds % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
          <div ref={waveformRef} className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
        </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard 
          label="Flow & Fluency" 
          value={result.metrics.fluency.value} 
          score={result.metrics.fluency.score} 
          feedback={result.metrics.fluency.feedback}
        />
        <MetricCard 
          label="Speaking Pace" 
          value={result.metrics.pace.value} 
          score={result.metrics.pace.score} 
          feedback={result.metrics.pace.feedback}
        />
        <MetricCard 
          label="Vocal Clarity" 
          value={result.metrics.clarity.value} 
          score={result.metrics.clarity.score} 
          feedback={result.metrics.clarity.feedback}
        />
        <MetricCard 
          label="Linguistic Depth" 
          value={result.metrics.vocabulary.value} 
          score={result.metrics.vocabulary.score} 
          feedback={result.metrics.vocabulary.feedback}
        />
      </div>

      {/* Detailed Feedback Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-10 rounded-[3rem] bg-zinc-900 border border-white/5 space-y-8">
             <div className="flex items-center gap-3">
               <Heart className="w-6 h-6 text-emerald-500" />
               <h3 className="text-2xl font-bold">Key Strengths</h3>
             </div>
             <div className="grid gap-4">
                {result.conversationalFeedback.strengths.map((strength, i) => (
                  <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                    <p className="text-zinc-300 leading-relaxed italic">{strength}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-10 rounded-[3rem] bg-zinc-900 border border-white/5 space-y-8">
             <div className="flex items-center gap-3">
               <Target className="w-6 h-6 text-yellow-500" />
               <h3 className="text-2xl font-bold">Gentle Improvements</h3>
             </div>
             <div className="grid gap-4">
                {result.conversationalFeedback.improvements.map((improvement, i) => (
                  <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-white/5 border border-white/5">
                    <ArrowRight className="w-5 h-5 text-yellow-500 shrink-0 mt-1" />
                    <p className="text-zinc-300 leading-relaxed italic">{improvement}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-6">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              Filler Profile
            </h4>
            <div className="space-y-4">
              {result.fillerWords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(result.fillerWords)).map((word) => (
                    <span key={word} className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-bold border border-white/5">
                      {word}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 italic">No significant verbal fillers detected in this session. Excellent focus.</p>
              )}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
             <h4 className="text-sm font-bold text-emerald-500 flex items-center gap-2 uppercase tracking-widest">
               <Sparkles className="w-4 h-4" />
               Daily Goal
             </h4>
             <p className="text-sm text-emerald-400/80 leading-relaxed italic">
               Consistency is secret to eloquence. Practice once more tomorrow to solidify your {result.metrics.vocabulary.value} vocabulary.
             </p>
          </div>
        </div>
      </div>

      {/* Transcript Review */}
      <div className="p-10 rounded-[3rem] bg-zinc-950 border border-white/5 space-y-6 shadow-3xl">
        <h3 className="text-xl font-bold italic opacity-60">Transcript Review</h3>
        <p className="text-zinc-400 leading-[2] text-lg font-medium italic border-l border-white/10 pl-8">
          {result.transcript}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 pt-10">
         <button 
           onClick={onBack}
           className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-bold border border-white/5 hover:bg-zinc-800 transition-all shadow-xl"
         >
           Close Results
         </button>
         <button 
           onClick={onDelete}
           className="px-10 py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2"
         >
           <Trash2 className="w-5 h-5" />
           Delete Session
         </button>
      </div>
      </div>
    </div>
  );
}
