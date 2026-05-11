import { 
  Clock, 
  Mic, 
  ChevronRight,
  ArrowRight,
  BookOpen,
  Zap,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';
import { PracticeSession } from '../../types/communication';

interface DashboardProps {
  onNewSession: () => void;
  onViewSession: (session: PracticeSession) => void;
  onDeleteSession: (id: string) => void;
  history: PracticeSession[];
}

export function DashboardContent({ onNewSession, onViewSession, onDeleteSession, history }: DashboardProps) {
  const totalSessions = history.length;
  const avgScore = totalSessions > 0 
    ? Math.round(history.reduce((acc, s) => acc + s.overallScore, 0) / totalSessions)
    : 0;
  
  const totalMinutes = Math.floor(history.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white italic">
          {totalSessions === 0 ? "Hello. Ready to practice?" : "Welcome back."}
        </h1>
        <p className="text-zinc-500 max-w-md mx-auto text-lg leading-relaxed">
          {totalSessions === 0 
            ? "SpeakBetter is your personal space to improve English speaking through honest, quiet feedback." 
            : `You've completed ${totalSessions} sessions and practiced for ${totalMinutes} minutes.`}
        </p>
        <div className="pt-4">
          <button 
            onClick={onNewSession}
            className="group relative px-8 py-4 bg-emerald-500 text-emerald-950 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 mx-auto shadow-2xl shadow-emerald-500/20"
          >
            Start a new session
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {totalSessions > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 text-center space-y-2">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Average Fluency</p>
            <p className="text-4xl font-bold text-white">{avgScore}%</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 text-center space-y-2">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Total Practice</p>
            <p className="text-4xl font-bold text-white">{totalMinutes}m</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 text-center space-y-2">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Growth Rate</p>
            <p className="text-4xl font-bold text-white">Stable</p>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      {totalSessions > 0 && (
        <div className="space-y-6 px-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Practices</h3>
            <button className="text-xs font-bold text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-2 uppercase tracking-widest">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid gap-4">
            {history.slice(0, 3).map((session) => (
              <motion.div 
                key={session.id}
                whileHover={{ x: 4 }}
                className="group relative"
              >
                <div 
                  onClick={() => onViewSession(session)}
                  className="flex items-center justify-between p-6 rounded-[1.5rem] bg-zinc-900 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                        {session.topic?.text ? `Regarding "${session.topic.text.slice(0, 40)}..."` : "Casual Practice"}
                      </h4>
                      <p className="text-sm text-zinc-500 mt-1 first-letter:uppercase">
                        {new Date(session.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • {Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">{session.overallScore}%</div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fluency</div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {totalSessions === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
          <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500">
              <Mic className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-xl">Practice Lab</h4>
            <p className="text-zinc-500 leading-relaxed italic">
              Recording your self speaking is the most efficient way to detect verbal crutches and fillers.
            </p>
          </div>
          <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-xl">Quiet Analysis</h4>
            <p className="text-zinc-500 leading-relaxed italic">
              Get gentle, human-like feedback on your pace, clarity, and choices after every session.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
