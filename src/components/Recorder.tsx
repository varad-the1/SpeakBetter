import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  isProcessing: boolean;
}

export const Recorder: React.FC<RecorderProps> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [realtimeTranscript, setRealtimeTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setRealtimeTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const startRecording = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });

      if (permissionStatus.state === 'denied') {
        alert('Microphone access was permanently denied. Please enable it in your browser settings for this site.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob, duration);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      setRealtimeTranscript('');
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please ensure it is enabled in your browser settings and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-2xl shadow-xl">
      <AnimatePresence mode="wait">
        {!isRecording ? (
          <motion.button
            key="start"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={startRecording}
            disabled={isProcessing}
            className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic className="w-10 h-10" />
            <div className="absolute -inset-2 rounded-full border border-accent/20 animate-ping group-hover:hidden" />
          </motion.button>
        ) : (
          <motion.button
            key="stop"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={stopRecording}
            className="flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <Square className="w-10 h-10 fill-current" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="mt-6 flex flex-col items-center w-full">
        <div className="flex items-center gap-2 text-2xl font-mono font-medium text-zinc-100">
          <Timer className="w-5 h-5 text-zinc-400" />
          {formatTime(duration)}
        </div>
        <p className="mt-2 text-sm text-zinc-500 uppercase tracking-widest font-medium">
          {isRecording ? 'Recording...' : isProcessing ? 'Analyzing Speech...' : 'Tap to Start'}
        </p>
      </div>

      <AnimatePresence>
        {isRecording && realtimeTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 w-full p-4 bg-zinc-900/50 border border-border/50 rounded-xl text-center"
          >
            <p className="text-sm text-zinc-400 font-mono leading-relaxed italic">
              "{realtimeTranscript}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {isProcessing && (
        <div className="mt-4 flex items-center gap-2 text-accent animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs font-mono">AI Coach is listening...</span>
        </div>
      )}
    </div>
  );
};
