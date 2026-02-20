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

  return (
    <div className="h-full overflow-y-auto px-5 py-5">
      <div className="mx-auto w-full max-w-[980px]">
        {messages.length === 0 && (
          <div className="py-16">
            <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">READY</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Awaiting input</div>
            <div className="mt-3 text-sm text-[var(--text-2)]">
              Use voice control or type a message in the composer.
            </div>
          </div>
        )}

        <div className="space-y-5">
          {messages.map((message) => (
            <div key={message.id} className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-2">
                <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">
                  {message.role === 'user' ? 'USER' : 'JARVIS'}
                </div>
                <div className="mt-1 text-xs font-mono text-[var(--text-3)]">{formatTime(message.timestamp)}</div>
              </div>
              <div
                className="col-span-12 md:col-span-10 border border-[var(--stroke-1)] bg-[var(--bg-2)] px-4 py-3"
                style={{ borderRadius: 'var(--r-1)' }}
              >
                <div
                  className="jarvis-markdown text-[var(--text-1)]"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-2">
                <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">JARVIS</div>
                <div className="mt-1 text-xs font-mono text-[var(--text-3)]">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div
                className="col-span-12 md:col-span-10 border border-[var(--stroke-1)] bg-[var(--bg-2)] px-4 py-3"
                style={{ borderRadius: 'var(--r-1)' }}
              >
                <div className="text-sm text-[var(--text-2)] font-mono">Processing…</div>
                <div className="mt-3 h-px w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
