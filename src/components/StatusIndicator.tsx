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
  return (
    <div className="flex items-center gap-4">
      {/* Connection Status */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-xl shadow-sm">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}
        ></div>
        <span className="text-sm font-semibold text-gray-700">
          {isConnected ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      {/* Activity Status */}
      {(isListening || isProcessing) && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-200/50">
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            <div className="w-1 h-4 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-4 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isProcessing ? 'PROCESSING' : 'LISTENING'}
          </span>
        </div>
      )}
    </div>
  );
};
