import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import type { Message } from '../types/jarvis';
import '../App.css';

interface ChatDisplayProps {
  messages: Message[];
  isProcessing: boolean;
}

export const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages, isProcessing }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Configure marked options
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessage = (content: string) => {
    try {
      return marked.parse(content);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return content;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl">🤖</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">JARVIS AI Assistant</h2>
            <p className="text-base text-gray-600">Tekan tombol mikrofon untuk memulai percakapan</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-xs lg:max-w-2xl px-6 py-4 rounded-2xl shadow-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-purple-50 border border-purple-200 text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-semibold ${
                  message.role === 'user' ? 'text-blue-100' : 'text-purple-600'
                }`}>
                  {message.role === 'user' ? '👤 USER' : '🤖 JARVIS'}
                </span>
                <span className={`text-xs ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div 
                className={`text-base leading-relaxed ${
                  message.role === 'user' ? 'text-white' : 'text-gray-800'
                } prose prose-sm max-w-none`}
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start animate-slideUp">
            <div className="bg-purple-50 border border-purple-200 text-gray-800 max-w-xs lg:max-w-2xl px-6 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-purple-600">🤖 JARVIS</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-base font-mono">Menganalisis...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
