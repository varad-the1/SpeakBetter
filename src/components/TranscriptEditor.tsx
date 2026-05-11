import React, { useState } from 'react';
import { Edit3, Check, X, Loader2 } from 'lucide-react';

interface TranscriptEditorProps {
  transcript: string;
  onSave: (newTranscript: string) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const TranscriptEditor: React.FC<TranscriptEditorProps> = ({ transcript, onSave, onCancel, isSaving }) => {
  const [text, setText] = useState(transcript);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          Edit Transcript
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={onCancel}
            disabled={isSaving}
            className="p-2 text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onSave(text)}
            disabled={isSaving}
            className="p-2 text-accent hover:text-accent/80 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-48 bg-zinc-900 border border-border rounded-xl p-4 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent resize-none"
        placeholder="Your transcript will appear here..."
      />
      
      <p className="mt-4 text-xs text-zinc-500 italic">
        Tip: Correct any transcription errors before AI analysis for more accurate feedback.
      </p>
    </div>
  );
};
