import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { SourceCard } from './SourceCard';
import { Bot, User, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'assistant';

  return (
    <div className={`flex w-full mb-8 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-4xl w-full gap-4 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isBot ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/20' : 'bg-gray-700 text-gray-300'
        }`}>
          {isBot ? <Bot size={20} /> : <User size={20} />}
        </div>

        {/* Content Bubble */}
        <div className={`flex-1 min-w-0 ${isBot ? '' : 'text-right'}`}>
          <div className={`inline-block text-left p-4 rounded-2xl ${
            isBot 
              ? 'bg-transparent text-gray-100' 
              : 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20'
          } ${message.isError ? 'border border-red-500/50 bg-red-900/10' : ''}`}>
            
            {message.isError && (
              <div className="flex items-center gap-2 text-red-400 mb-2 font-semibold">
                <AlertCircle size={16} />
                <span>Error</span>
              </div>
            )}

            <div className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>

            {/* Sources Section (Bot Only) */}
            {isBot && message.sources && message.sources.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-800/60">
                <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Verified Sources & Regulations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {message.sources.map((source, idx) => (
                    <SourceCard key={idx} source={source} index={idx} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`mt-1 text-xs text-gray-500 ${isBot ? 'text-left' : 'text-right'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
