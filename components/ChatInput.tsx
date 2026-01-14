import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent pb-6 pt-12">
      <div className="max-w-4xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
          
          <div className="relative bg-gray-900 rounded-xl flex items-end p-2 border border-gray-800 shadow-2xl">
            <div className="pl-3 pb-3 text-gray-500">
              <Sparkles size={20} className={disabled ? "animate-pulse" : ""} />
            </div>
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Ask about UKGC financial vulnerability checks or regulations..."
              className="w-full bg-transparent text-gray-100 placeholder-gray-500 px-4 py-3 focus:outline-none resize-none max-h-[200px] min-h-[50px] scrollbar-hide"
              rows={1}
            />
            
            <button
              type="submit"
              disabled={!input.trim() || disabled}
              className={`p-3 rounded-lg transition-all duration-200 mb-0.5 ${
                input.trim() && !disabled
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
        <div className="text-center mt-2 text-xs text-gray-600">
          AI can make mistakes. Please verify important information with official UKGC documentation.
        </div>
      </div>
    </div>
  );
};
