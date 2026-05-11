import { motion } from 'motion/react';
import { Mic, ArrowRight, MessageSquare, Sparkles, Heart } from 'lucide-react';

export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden flex flex-col items-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      {/* Nav */}
      <nav className="w-full max-w-5xl px-8 py-12 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 shadow-2xl shadow-emerald-500/20 flex items-center justify-center text-emerald-950">
            <Mic className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tighter italic text-white">SpeakBetter</span>
        </div>
        <button 
          onClick={onStart}
          className="px-6 py-2.5 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-bold text-sm border border-white/5"
        >
          Open Lab
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 w-full max-w-5xl px-8 pt-20 pb-40 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3 h-3" />
            Your Personal Practice Space
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[0.9] italic">
            Quiet feedback <br />
            <span className="text-emerald-500 not-italic font-medium opacity-80">for a better voice.</span>
          </h1>
          
          <p className="max-w-xl text-xl text-zinc-500 leading-relaxed mx-auto italic font-medium">
            SpeakBetter is a calm, minimal companion designed to help you refine your English speaking through honest analysis and gentle guidance.
          </p>

          <div className="pt-10">
            <button 
              onClick={onStart}
              className="group relative px-10 py-5 bg-emerald-500 text-emerald-950 rounded-[2rem] font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4 mx-auto shadow-2xl shadow-emerald-500/20"
            >
              Start practicing
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Minimal Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 w-full max-w-4xl relative"
        >
          <div className="relative rounded-[3rem] border border-white/5 bg-zinc-900 shadow-3xl overflow-hidden p-2">
             <div className="rounded-[2.5rem] bg-zinc-950 p-12 flex flex-col items-center justify-center space-y-8 aspect-video">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                   <Mic className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-zinc-900 rounded-full mx-auto animate-pulse" />
                  <div className="h-4 w-32 bg-zinc-900 rounded-full mx-auto animate-pulse opacity-50" />
                </div>
             </div>
          </div>
        </motion.div>
      </main>

      {/* Philosophy */}
      <section className="w-full max-w-5xl px-8 py-40 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5">
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-emerald-500 border border-white/5">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white italic">Topic Prompts</h3>
          <p className="text-zinc-500 leading-relaxed">
            Never struggle with what to say. Generate thoughtful prompts across casual and technical categories.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-emerald-500 border border-white/5">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white italic">Gentle Insights</h3>
          <p className="text-zinc-500 leading-relaxed">
            Get human-like, supportive feedback on your pace, clarity, and vocabulary after every session.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-emerald-500 border border-white/5">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white italic">Private Lab</h3>
          <p className="text-zinc-500 leading-relaxed">
            Your practices are yours. Speak freely in a safe, quiet space designed for personal growth.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl px-8 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <Mic className="w-5 h-5 text-zinc-600" />
          <span className="font-bold text-white italic">SpeakBetter</span>
        </div>
        <p className="text-zinc-600 text-sm font-medium italic">Handcrafted for a more expressive world.</p>
      </footer>
    </div>
  );
}
