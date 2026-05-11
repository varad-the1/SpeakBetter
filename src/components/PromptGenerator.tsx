import React, { useState, useEffect } from 'react';
import { Difficulty, SpeakingTopic } from '../types';
import { Lightbulb, ChevronRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TOPICS: Omit<SpeakingTopic, 'id' | 'date'>[] = [
  { text: "Describe your biggest academic fear and how you plan to overcome it.", difficulty: Difficulty.ACADEMIC },
  { text: "Explain a technical concept you recently learned in simple words for a non-expert.", difficulty: Difficulty.TECHNICAL },
  { text: "Why did you choose your specific field of study or profession?", difficulty: Difficulty.INTERVIEW },
  { text: "Describe a time you failed at something and what you learned from it.", difficulty: Difficulty.INTERVIEW },
  { text: "What is your favorite way to spend a weekend and why?", difficulty: Difficulty.CASUAL },
  { text: "If you could change one thing about the education system, what would it be?", difficulty: Difficulty.ACADEMIC },
  { text: "Explain how a blockchain works as if I'm five years old.", difficulty: Difficulty.TECHNICAL },
  { text: "Where do you see yourself professionally in five years?", difficulty: Difficulty.INTERVIEW },
];

export const PromptGenerator: React.FC = () => {
  const [topic, setTopic] = useState<Omit<SpeakingTopic, 'id' | 'date'> | null>(null);

  const generateNew = () => {
    const randomIndex = Math.floor(Math.random() * TOPICS.length);
    setTopic(TOPICS[randomIndex]);
  };

  useEffect(() => {
    generateNew();
  }, []);

  if (!topic) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Lightbulb className="w-24 h-24" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Daily Prompt</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${getDifficultyColor(topic.difficulty)}`}>
            {topic.difficulty}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.p 
            key={topic.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-medium text-zinc-100 leading-relaxed mb-6"
          >
            "{topic.text}"
          </motion.p>
        </AnimatePresence>

        <button 
          onClick={generateNew}
          className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-accent transition-colors group"
        >
          <RotateCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
          Try another topic
        </button>
      </div>
    </div>
  );
};

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.CASUAL: return "text-blue-400 border-blue-400/20 bg-blue-400/5";
    case Difficulty.ACADEMIC: return "text-purple-400 border-purple-400/20 bg-purple-400/5";
    case Difficulty.INTERVIEW: return "text-emerald-400 border-emerald-400/20 bg-emerald-400/5";
    case Difficulty.TECHNICAL: return "text-orange-400 border-orange-400/20 bg-orange-400/5";
    default: return "text-zinc-400 border-zinc-400/20 bg-zinc-400/5";
  }
};
