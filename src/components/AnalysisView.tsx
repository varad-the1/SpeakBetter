import React from 'react';
import { AnalysisResult } from '../types';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Briefcase, 
  Zap,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';

interface AnalysisViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const highlightFillers = (text: string, fillers: string[]) => {
  if (!fillers.length) return text;
  const regex = new RegExp(`\\b(${fillers.join('|')})\\b`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    if (fillers.some(f => f.toLowerCase() === part.toLowerCase())) {
      return <span key={i} className="bg-accent/20 text-accent px-1 rounded border border-accent/30 font-bold">{part}</span>;
    }
    return part;
  });
};

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Analysis Feedback</h2>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Start New
        </button>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 gap-4">
        <ScoreCard 
          label="Fluency" 
          score={result.fluencyScore} 
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />} 
        />
        <ScoreCard 
          label="Confidence" 
          score={result.confidenceScore} 
          icon={<Zap className="w-5 h-5 text-yellow-400" />} 
        />
      </div>

      {/* Filler Words */}
      <section className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Filler Word Detection
          </h3>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-accent">{result.totalFillerCount}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Count</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.fillerWords.map((fw, i) => (
            <div key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-mono flex items-center gap-2 border border-border">
              <span className="text-zinc-400">{fw.word}</span>
              <span className="text-accent font-bold">{fw.count}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
          <span className="text-zinc-500">Filler words per minute</span>
          <span className="font-mono text-accent">{result.fillerPerMinute}</span>
        </div>
      </section>

      {/* Accent Analysis */}
      {result.accentAnalysis && (
        <section className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              Accent & Clarity Analysis
            </h3>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-orange-400">{result.accentAnalysis.clarityScore}/10</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Clarity Score</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400/70" />
                Pronunciation Issues
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.accentAnalysis.pronunciationIssues.map((issue, i) => (
                  <li key={i} className="text-sm text-zinc-300 bg-zinc-900/50 border border-border/50 p-3 rounded-lg flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400/70" />
                Intonation & Rhythm
              </h4>
              <p className="text-sm text-zinc-300 bg-zinc-900/50 border border-border/50 p-4 rounded-lg leading-relaxed">
                {result.accentAnalysis.intonationFeedback}
              </p>
            </div>

            <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-3">Actionable Tips for Clarity</h4>
              <ul className="space-y-2">
                {result.accentAnalysis.actionableTips.map((tip, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-orange-400">
                      {i + 1}
                    </div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Grammar & Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Grammar Mistakes
          </h3>
          <ul className="space-y-3">
            {result.grammarMistakes.map((m, i) => (
              <li key={i} className="text-sm text-zinc-300 flex gap-3">
                <span className="text-red-500 mt-1">•</span>
                {m}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            Common Patterns
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {result.commonPatterns}
          </p>
        </section>
      </div>

      {/* Transcript with Highlighting */}
      <section className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          Transcript Analysis
        </h3>
        <div className="p-4 bg-zinc-900/50 rounded-lg text-sm text-zinc-300 leading-relaxed border border-border/50 font-mono">
          {highlightFillers(result.transcript, result.fillerWords.map(fw => fw.word))}
        </div>
      </section>

      {/* Rewritten Versions */}
      <div className="space-y-6">
        <section className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            Natural Spoken Version
          </h3>
          <div className="p-4 bg-zinc-900/50 rounded-lg text-sm text-zinc-300 italic border border-border/50">
            "{result.rewrittenNatural}"
          </div>
        </section>

        <section className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            Interview-Ready Version
          </h3>
          <div className="p-4 bg-zinc-900/50 rounded-lg text-sm text-zinc-300 border border-border/50">
            {result.interviewLevel}
          </div>
        </section>
      </div>

      {/* Exercises */}
      <section className="bg-accent/5 border border-accent/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-accent mb-4">Personalized Exercises</h3>
        <div className="grid grid-cols-1 gap-4">
          {result.exercises.map((ex, i) => (
            <div key={i} className="p-4 bg-surface border border-border rounded-lg text-sm">
              <div className="font-bold text-accent mb-1">Exercise {i + 1}</div>
              <div className="text-zinc-300">{ex}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ScoreCard = ({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) => (
  <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center">
    <div className="mb-2">{icon}</div>
    <div className="text-3xl font-mono font-bold text-white">{score}/10</div>
    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mt-1">{label}</div>
    <div className="w-full h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score * 10}%` }}
        className="h-full bg-accent"
      />
    </div>
  </div>
);
