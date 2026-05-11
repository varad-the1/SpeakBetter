import { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  MessageSquare, 
  RefreshCw,
  Play,
  RotateCcw,
  BookOpen,
  Send,
  Timer,
  Book as BookIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PracticeLabProps {
  onAnalysisStart: (audioBase64: string, duration: number, topicText?: string) => void;
}

const topics = [
  { category: 'Casual', text: 'Talk about your favorite way to spend a rainy afternoon.', duration: '1 min' },
  { category: 'Technical', text: 'Explain the concept of "Cloud Computing" as if you were talking to a 10-year-old.', duration: '2 min' },
  { category: 'Interview', text: 'Walk me through a project where you had to work with a difficult teammate.', duration: '2-3 min' },
  { category: 'Abstract', text: 'If you could change one thing about how humans communicate, what would it be?', duration: '2 min' },
  { category: 'College Life', text: 'What is the most valuable lesson you learned outside of the classroom?', duration: '1 min' },
  { category: 'Debate', text: 'Is it better to be a generalist or a specialist in today\'s economy?', duration: '2 min' },
  { category: 'Storytelling', text: 'Tell a story about a time you felt completely out of your comfort zone.', duration: '2 min' },
];

export function PracticeLab({ onAnalysisStart }: PracticeLabProps) {
  const [step, setStep] = useState<'topic' | 'record' | 'review'>('topic');
  const [currentTopic, setCurrentTopic] = useState(topics[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateTopic = () => {
    const fresh = topics[Math.floor(Math.random() * topics.length)];
    setCurrentTopic(fresh);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setStep('review');
      };

      recorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch (err) {
      console.error("Mic access denied", err);
      alert("Microphone access is required to practice.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const handleFinish = async () => {
    if (!audioBlob) return;
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      onAnalysisStart(base64, duration, currentTopic.text);
    };
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-[600px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === 'topic' && (
          <motion.div
            key="topic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12 text-center"
          >
            <div className="space-y-4">
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em] border border-emerald-500/20">
                Personal Practice
              </span>
              <h2 className="text-5xl font-bold tracking-tight text-white leading-tight italic">
                What's on your mind?
              </h2>
            </div>

            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-12 rounded-[2.5rem] bg-zinc-900 border border-white/5 shadow-2xl space-y-8">
                <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <span className="flex items-center gap-1.5"><BookIcon className="w-3 h-3" /> {currentTopic.category}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                  <span className="flex items-center gap-1.5"><Timer className="w-3 h-3" /> {currentTopic.duration}</span>
                </div>
                <p className="text-3xl font-medium text-white italic leading-relaxed">
                  "{currentTopic.text}"
                </p>
                <div className="pt-6 flex items-center justify-center gap-4">
                  <button 
                    onClick={generateTopic}
                    className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-zinc-800 text-zinc-400 font-bold hover:bg-zinc-700 transition-all border border-white/5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New Topic
                  </button>
                  <button 
                    onClick={() => setStep('record')}
                    className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-emerald-500 text-emerald-950 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20"
                  >
                    Start speaking
                    <Play className="w-4 h-4 fill-emerald-950" />
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setCurrentTopic({ category: 'Free Talk', text: 'Anything you want to talk about.', duration: 'Any' });
                setStep('record');
              }}
              className="text-zinc-500 hover:text-white transition-colors text-sm font-medium border-b border-white/5 pb-1"
            >
              Or just speak freely without a prompt
            </button>
          </motion.div>
        )}

        {step === 'record' && (
          <motion.div
            key="record"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center space-y-16 py-10"
          >
            <div className="text-center space-y-6">
               <p className="text-zinc-400 text-lg font-medium italic max-w-lg mx-auto opacity-60">"{currentTopic.text}"</p>
               <div className="text-7xl font-bold tracking-tighter tabular-nums text-white">
                 {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
               </div>
            </div>

            <div className="relative">
              <AnimatePresence>
                {isRecording && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.8, opacity: 1 }}
                    exit={{ scale: 2.2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute inset-0 rounded-full bg-emerald-500/10"
                  />
                )}
              </AnimatePresence>
              
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-zinc-800 text-red-500 shadow-inner' 
                    : 'bg-emerald-500 text-emerald-950 shadow-2xl shadow-emerald-500/30'
                }`}
              >
                {isRecording ? (
                  <div className="space-y-1 flex flex-col items-center">
                    <Square className="w-10 h-10 fill-red-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Stop</span>
                  </div>
                ) : (
                  <div className="space-y-1 flex flex-col items-center">
                    <Mic className="w-12 h-12" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Record</span>
                  </div>
                )}
              </button>
            </div>

            <p className="text-zinc-500 text-sm font-medium tracking-wide">
              {isRecording ? "Recording your practice session..." : "Tap to start recording"}
            </p>
            
            {isRecording && (
              <button 
                onClick={() => { stopRecording(); setStep('topic'); setDuration(0); }}
                className="px-6 py-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-600 hover:text-red-400 transition-all text-[10px] font-bold uppercase tracking-widest"
              >
                Cancel Session
              </button>
            )}
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-bold italic">Review Practice</h3>
              <p className="text-zinc-500 text-lg">Would you like to analyze this session or try again?</p>
            </div>

            <div className="p-10 rounded-[3rem] bg-zinc-900 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                 <Mic className="w-32 h-32" />
               </div>
               
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-10">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-800 flex items-center justify-center text-emerald-500">
                      <Timer className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Duration</p>
                      <p className="text-3xl font-bold text-white">{Math.floor(duration / 60)}m {duration % 60}s</p>
                    </div>
                 </div>
                 <div className="w-full md:w-auto">
                    <audio src={audioUrl || ''} controls className="w-full h-10 opacity-60 hover:opacity-100 transition-opacity" />
                 </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                   onClick={() => { setStep('topic'); setDuration(0); setAudioBlob(null); }}
                   className="flex-1 px-8 py-5 rounded-2xl bg-zinc-800 text-zinc-400 font-bold hover:bg-zinc-700 hover:text-white transition-all border border-white/5 flex items-center justify-center gap-3"
                 >
                   <RotateCcw className="w-5 h-5" />
                   Discard and Retry
                 </button>
                 <button 
                   onClick={handleFinish}
                   className="flex-1 px-8 py-5 rounded-2xl bg-emerald-500 text-emerald-950 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
                 >
                   <Send className="w-5 h-5" />
                   Analyze Session
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
