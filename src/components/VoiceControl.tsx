import React from 'react';

interface VoiceControlProps {
  isListening: boolean;
  isAlwaysListening: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleAlwaysListening: () => void;
  onClearConversation: () => void;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({
  isListening,
  isAlwaysListening,
  isProcessing,
  onStartListening,
  onStopListening,
  onToggleAlwaysListening,
  onClearConversation,
}) => {
  const listenLabel = isProcessing ? 'Busy' : isAlwaysListening ? 'Stop' : isListening ? 'Stop' : 'Listen';
  const onListenClick = isAlwaysListening ? onStopListening : (isListening ? onStopListening : onStartListening);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onListenClick}
          disabled={isProcessing}
          className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] bg-transparent text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderRadius: 'var(--r-1)' }}
        >
          {listenLabel}
        </button>

        <button
          onClick={onToggleAlwaysListening}
          className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] bg-transparent text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)]"
          style={{ borderRadius: 'var(--r-1)', borderColor: isAlwaysListening ? 'rgba(59, 130, 246, 0.45)' : 'var(--stroke-1)' }}
        >
          {isAlwaysListening ? 'Always On' : 'Push to Talk'}
        </button>

        <button
          onClick={onClearConversation}
          className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] bg-transparent text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)]"
          style={{ borderRadius: 'var(--r-1)' }}
        >
          Clear
        </button>
      </div>

      <div
        className="h-9 px-3 border border-[var(--stroke-1)] bg-[var(--bg-2)] flex items-center"
        style={{ borderRadius: 'var(--r-1)' }}
      >
        <span className="text-xs font-mono text-[var(--text-3)]">
          {isProcessing ? 'processing' : isAlwaysListening ? 'always_on' : isListening ? 'listening' : 'idle'}
        </span>
      </div>
    </div>
  );
};
