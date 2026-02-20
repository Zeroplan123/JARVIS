/**
 * Debug Panel - Shows real-time JARVIS status for troubleshooting
 */

import React from 'react';
import type { JarvisStatus } from '../hooks/usePassiveWakeWord';

interface DebugPanelProps {
  status: JarvisStatus;
  isEnabled: boolean;
  getDebugInfo: () => any;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ 
  status, 
  isEnabled, 
  getDebugInfo 
}) => {
  const debugInfo = getDebugInfo();
  
  const getStateColor = (state: string) => {
    switch (state) {
      case 'idle': return 'text-gray-500';
      case 'passive': return 'text-green-500';
      case 'waking_up': return 'text-yellow-500';
      case 'recording_cmd': return 'text-blue-500';
      case 'processing': return 'text-purple-500';
      case 'speaking': return 'text-orange-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-sm">
      <div className="mb-2 font-bold text-green-400">🔧 JARVIS Debug Panel</div>
      
      {/* Main Status */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">State:</span>
          <span className={`font-bold ${getStateColor(status.state)}`}>
            {status.state.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Enabled:</span>
          <span className={isEnabled ? 'text-green-400' : 'text-red-400'}>
            {isEnabled ? '✅ YES' : '❌ NO'}
          </span>
        </div>
      </div>

      {/* Flags */}
      <div className="mb-3 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Listening:</span>
          <span className={status.isListening ? 'text-green-400' : 'text-gray-500'}>
            {status.isListening ? '🎤 ON' : '🔇 OFF'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Processing:</span>
          <span className={status.isProcessing ? 'text-yellow-400' : 'text-gray-500'}>
            {status.isProcessing ? '⚡ YES' : '⏸️ NO'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Speaking:</span>
          <span className={status.isSpeaking ? 'text-orange-400' : 'text-gray-500'}>
            {status.isSpeaking ? '🗣️ YES' : '🤐 NO'}
          </span>
        </div>
      </div>

      {/* Service Status */}
      <div className="mb-3 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Wake Word:</span>
          <span className={debugInfo.wakeWordActive ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.wakeWordActive ? '✅ ACTIVE' : '❌ INACTIVE'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">STT:</span>
          <span className={debugInfo.sttActive ? 'text-blue-400' : 'text-gray-500'}>
            {debugInfo.sttActive ? '🎙️ ACTIVE' : '💤 IDLE'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">TTS:</span>
          <span className={debugInfo.ttsActive ? 'text-orange-400' : 'text-gray-500'}>
            {debugInfo.ttsActive ? '🔊 ACTIVE' : '🔇 IDLE'}
          </span>
        </div>
      </div>

      {/* State Machine Info */}
      {debugInfo.stateMachine && (
        <div className="mb-3">
          <div className="text-gray-400 mb-1">State Machine:</div>
          <div className="ml-2 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Cooldown:</span>
              <span className="text-yellow-400">
                {debugInfo.stateMachine.cooldownRemaining}ms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Processing:</span>
              <span className={debugInfo.stateMachine.isProcessingCommand ? 'text-red-400' : 'text-green-400'}>
                {debugInfo.stateMachine.isProcessingCommand ? '🔒 LOCKED' : '🔓 FREE'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Last Activity */}
      <div className="space-y-1">
        {status.lastCommand && (
          <div>
            <span className="text-gray-400">Last Cmd:</span>
            <div className="text-blue-300 truncate">"{status.lastCommand}"</div>
          </div>
        )}
        {status.lastResponse && (
          <div>
            <span className="text-gray-400">Last Resp:</span>
            <div className="text-green-300 truncate">"{status.lastResponse}"</div>
          </div>
        )}
        {status.error && (
          <div>
            <span className="text-red-400">Error:</span>
            <div className="text-red-300 truncate">{status.error}</div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-3 pt-2 border-t border-gray-600 text-gray-400 text-xs">
        💡 Check browser console for detailed logs
      </div>
    </div>
  );
};
