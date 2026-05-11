import { motion } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Command, 
  ChevronRight,
  User,
  ExternalLink
} from 'lucide-react';

interface TopNavProps {
  currentTab: string;
}

export function TopNav({ currentTab }: TopNavProps) {
  const getBreadcrumb = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'practice': return 'Lab Environment';
      case 'history': return 'Session Archive';
      case 'interviews': return 'Interview Intelligence';
      case 'insights': return 'Behavioral Analytics';
      default: return 'System';
    }
  };

  return (
    <header className="h-20 border-b border-white/5 bg-background sticky top-0 z-30 flex items-center justify-between px-10">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-zinc-500">Platform</span>
        <ChevronRight className="w-4 h-4 text-zinc-700" />
        <span className="text-white font-semibold">{getBreadcrumb(currentTab)}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 w-96 group transition-all hover:border-emerald-500/30">
          <Search className="w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search sessions or metrics..." 
            className="bg-transparent border-none outline-none text-xs text-zinc-300 w-full placeholder:text-zinc-600"
          />
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 border border-white/5 text-[10px] text-zinc-500 font-bold uppercase">
             <Command className="w-2 h-2" />
             K
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="relative w-10 h-10 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
             <Bell className="w-4 h-4" />
             <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-surface" />
           </button>
           
           <div className="h-8 w-[1px] bg-white/5 mx-2" />
           
           <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">Engineering Track</p>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mt-1">Status: Active</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <User className="w-5 h-5" />
              </div>
           </div>
        </div>
      </div>
    </header>
  );
}
