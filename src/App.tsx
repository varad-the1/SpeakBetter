import { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { Sidebar } from './components/dashboard/Sidebar';
import { TopNav } from './components/dashboard/TopNav';
import { DashboardContent } from './components/dashboard/Dashboard';
import { PracticeLab } from './components/dashboard/PracticeLab';
import { AnalysisResults } from './components/dashboard/AnalysisResults';
import { runPracticeAnalysis } from './services/analysisPipeline';
import { PracticeSession } from './types/communication';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Trash2 } from 'lucide-react';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentAnalysis, setCurrentAnalysis] = useState<PracticeSession | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<PracticeSession[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('speakbetter_v3_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('speakbetter_v3_history', JSON.stringify(history));
  }, [history]);

  const handleAnalysisStart = async (audioBase64: string, duration: number, topicText?: string) => {
    setIsAnalyzing(true);
    try {
      const result = await runPracticeAnalysis(audioBase64, 'audio/webm', duration, topicText);
      
      const sessionWithTopic: PracticeSession = {
        ...result,
        topic: topicText ? { category: 'Prompted', text: topicText } : undefined
      };

      setHistory(prev => [sessionWithTopic, ...prev]);
      setCurrentAnalysis(sessionWithTopic);
      setActiveTab('results');
    } catch (err) {
      console.error("Analysis failed", err);
      alert("Analysis failed. Please check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteSession = (id: string) => {
    if (window.confirm("Are you sure you want to delete this practice session?")) {
      setHistory(prev => prev.filter(s => s.id !== id));
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
        setActiveTab('dashboard');
      }
    }
  };

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="flex bg-background min-h-screen text-foreground selection:bg-emerald-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <TopNav currentTab={activeTab} />
        
        <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-4 border-emerald-500" 
                  />
                </div>
                <div className="space-y-2">
                   <h2 className="text-2xl font-bold tracking-tight italic">Listening deeply...</h2>
                   <p className="text-zinc-500 max-w-sm mx-auto">
                     I'm reviewing your practice session to provide helpful, honest feedback.
                   </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTab === 'dashboard' && (
                  <DashboardContent 
                    history={history} 
                    onNewSession={() => setActiveTab('practice')} 
                    onViewSession={(session) => {
                      setCurrentAnalysis(session);
                      setActiveTab('results');
                    }}
                    onDeleteSession={handleDeleteSession}
                  />
                )}
                {activeTab === 'practice' && <PracticeLab onAnalysisStart={handleAnalysisStart} />}
                {activeTab === 'results' && currentAnalysis && (
                  <AnalysisResults 
                    result={currentAnalysis} 
                    onBack={() => setActiveTab('dashboard')} 
                    onDelete={() => handleDeleteSession(currentAnalysis.id)}
                  />
                )}
                {activeTab === 'history' && (
                  <div className="max-w-4xl mx-auto space-y-8 py-10">
                    <h1 className="text-3xl font-bold tracking-tight italic">Practice History</h1>
                    {history.length === 0 ? (
                      <div className="py-20 text-center text-zinc-500 border border-dashed border-white/5 rounded-[2.5rem]">
                        Your practice history is empty.
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {history.map((session) => (
                          <div 
                            key={session.id}
                            className="group relative"
                          >
                            <div 
                              onClick={() => {
                                setCurrentAnalysis(session);
                                setActiveTab('results');
                              }}
                              className="p-6 rounded-[1.5rem] bg-zinc-900 border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer flex justify-between items-center"
                            >
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest leading-none">
                                  {new Date(session.timestamp).toLocaleDateString()}
                                </p>
                                <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                                  {session.topic?.text ? `"${session.topic.text.slice(0, 50)}..."` : "Casual Practice"}
                                </h4>
                              </div>
                              <div className="flex items-center gap-8">
                                <div className="text-right">
                                  <div className="text-xl font-bold text-emerald-500">{session.overallScore}%</div>
                                  <div className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest leading-none">Fluency</div>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(session.id);
                                  }}
                                  className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function BrainCircuit({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 4.5V2" />
      <path d="M18 11.5a6 6 0 1 0-11 3.5" />
      <path d="m15 13-1-1-1 1" />
      <path d="M12 11.5V13" />
      <path d="M13 22h-2a2 2 0 0 1-2-2V13.5a2.5 2.5 0 0 1 5 0V20a2 2 0 0 1-2 2Z" />
      <path d="M18 11.5h2" />
      <path d="M4 11.5h2" />
    </svg>
  );
}
