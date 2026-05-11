import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  History, 
  Mic, 
  Settings,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'practice', label: 'Practice', icon: Mic },
  { id: 'history', label: 'Archive', icon: History },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-zinc-950 sticky top-0 flex flex-col p-8 overflow-hidden">
      <div className="flex items-center gap-3 mb-16">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 shadow-2xl shadow-emerald-500/20 flex items-center justify-center text-emerald-950">
          <Mic className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-xl tracking-tight leading-none italic">SpeakBetter</h2>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mt-1 block">Companion</span>
        </div>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all group relative",
              activeTab === item.id 
                ? "bg-emerald-500/10 text-emerald-400" 
                : "text-zinc-500 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              activeTab === item.id ? "text-emerald-400" : "text-zinc-600 group-hover:text-zinc-400"
            )} />
            {item.label}
            {activeTab === item.id && (
              <motion.div 
                layoutId="navGlow"
                className="absolute inset-0 bg-emerald-500/5 rounded-2xl -z-10" 
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-6">
        <div className="p-5 rounded-3xl bg-zinc-900 border border-white/5 space-y-3">
           <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 leading-none">Status</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-bold text-zinc-300">Ready to listen</span>
           </div>
        </div>
        
        <button className="flex items-center gap-3 px-4 text-zinc-600 hover:text-white transition-colors text-sm font-bold group">
          <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
          Settings
        </button>
      </div>
    </aside>
  );
}
