import React from 'react';

interface StatusIndicatorProps {
  isConnected: boolean;
  isListening: boolean;
  isProcessing: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isConnected,
  isListening,
  isProcessing,
}) => {
  const activity = isProcessing ? 'PROCESSING' : isListening ? 'LISTENING' : 'IDLE';

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-2 px-3 h-9 border border-[var(--stroke-1)] bg-[var(--bg-2)]"
        style={{ borderRadius: 'var(--r-1)' }}
      >
        <span
          className="inline-block w-1.5 h-1.5"
          style={{
            borderRadius: 2,
            background: isConnected ? 'var(--accent)' : 'rgba(255,255,255,0.28)'
          }}
        />
        <span className="text-xs font-medium tracking-[0.18em] text-[var(--text-2)]">
          {isConnected ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      <div
        className="px-3 h-9 border border-[var(--stroke-1)] bg-[var(--bg-2)] flex items-center"
        style={{ borderRadius: 'var(--r-1)', borderColor: activity !== 'IDLE' ? 'var(--stroke-2)' : 'var(--stroke-1)' }}
      >
        <span className="text-xs font-mono text-[var(--text-3)]">{activity.toLowerCase()}</span>
      </div>
    </div>
  );
};
