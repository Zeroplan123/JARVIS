import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import type { Message } from '../types/jarvis';

interface ChatDisplayProps {
  messages: Message[];
  isProcessing: boolean;
}

export const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages, isProcessing }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
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

  const isUser = (m: Message) => m.role === 'user';

  return (
    <div className="h-full overflow-y-auto px-5 py-6">
      <div className="mx-auto w-full max-w-[980px]">
        {messages.length === 0 && (
          <div className="py-16">
            <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">READY</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Your AI workspace is ready</div>
            <div className="mt-3 text-sm text-[var(--text-2)]">
              Type a message below, or use voice control.
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => {
            const mine = isUser(message);
            return (
              <div key={message.id} className={mine ? 'flex justify-end' : 'flex justify-start'}>
                <div className="min-w-0 max-w-[92%] md:max-w-[78%]">
                  <div className={mine ? 'flex justify-end' : 'flex justify-start'}>
                    <div className="text-[11px] font-medium tracking-[0.16em] text-[var(--text-3)]">
                      {mine ? 'YOU' : 'JARVIS'}
                      <span className="ml-2 font-mono tracking-[0.08em]">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>

                  <div
                    className="mt-2 border border-[var(--stroke-1)] px-4 py-3"
                    style={{
                      borderRadius: 'var(--r-2)',
                      background: mine ? 'var(--bg-1)' : 'var(--bg-2)',
                      boxShadow: 'var(--shadow-1)'
                    }}
                  >
                    <div
                      className="jarvis-markdown text-[var(--text-1)]"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="min-w-0 max-w-[92%] md:max-w-[78%]">
                <div className="text-[11px] font-medium tracking-[0.16em] text-[var(--text-3)]">
                  JARVIS
                  <span className="ml-2 font-mono tracking-[0.08em]">
                    {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div
                  className="mt-2 border border-[var(--stroke-1)] px-4 py-3"
                  style={{ borderRadius: 'var(--r-2)', background: 'var(--bg-2)', boxShadow: 'var(--shadow-1)' }}
                >
                  <div className="text-sm text-[var(--text-2)] font-mono">Processing…</div>
                  <div className="mt-3 h-px w-full" style={{ background: 'rgba(15,18,23,0.08)' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
