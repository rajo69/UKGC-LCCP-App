import React, { useState, useRef, useEffect } from 'react';
import { CursorBackground } from './components/CursorBackground';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { sendMessageToApi } from './services/api';
import { ChatMessage as ChatMessageType } from './types';
import { Scale } from 'lucide-react';

const INITIAL_MESSAGE: ChatMessageType = {
  id: 'init-1',
  role: 'assistant',
  content: "Hello. I am your LCCP Regulatory Assistant.\n\nI can access the UKGC Code of Practice provisions and Operating License conditions. Ask me about financial vulnerability checks, anti-money laundering requirements, or specific regulation numbers.",
  timestamp: Date.now(),
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessageToApi(text);
      
      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : "I encountered an unknown error connecting to the regulation database.",
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      <CursorBackground />

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-20 flex items-center justify-center px-4">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-900/50 p-2 rounded-lg border border-cyan-500/30">
              <Scale className="text-cyan-400 w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-100">
              UKGC <span className="text-cyan-400">LCCP</span> Intelligence
            </h1>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto pt-24 pb-40 px-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start w-full mb-8 animate-pulse">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-900/20 border border-cyan-500/10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-2xl rounded-tl-none border border-gray-800 flex items-center gap-1">
                    <span className="text-sm text-gray-400">Analyzing regulations</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
               </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </main>

        {/* Input Area */}
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default App;
