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
  return (
    <div className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-center gap-8">
        {/* Main Voice Control Button */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={isAlwaysListening ? onStopListening : (isListening ? onStopListening : onStartListening)}
            disabled={isProcessing}
            className={`relative w-24 h-24 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isAlwaysListening
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-xl shadow-green-500/40 animate-pulse'
                : isListening
                ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-xl shadow-red-500/40 animate-pulse'
                : isProcessing
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 shadow-xl shadow-yellow-500/40'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            <div className="flex items-center justify-center w-full h-full">
              {isProcessing ? (
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isAlwaysListening ? (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              ) : isListening ? (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a2 2 0 114 0v4a2 2 0 11-4 0V7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            
            {/* Pulse animation ring */}
            {(isListening || isAlwaysListening) && (
              <div className={`absolute inset-0 rounded-2xl border-2 animate-ping ${
                isAlwaysListening ? 'border-green-400' : 'border-red-400'
              }`}></div>
            )}
          </button>

          {/* Status Text */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">
              {isProcessing
                ? 'Memproses...'
                : isAlwaysListening
                ? 'Menunggu "JARVIS"...'
                : isListening
                ? 'Mendengarkan...'
                : 'Tekan untuk berbicara'
              }
            </p>
            <p className="text-base text-gray-600 mt-1">
              {isAlwaysListening 
                ? 'Katakan "JARVIS" untuk memulai'
                : isListening 
                ? 'Tekan lagi untuk berhenti' 
                : 'Atau aktifkan always listening'
              }
            </p>
          </div>
        </div>

        {/* Always Listening Toggle Button */}
        <button
          onClick={onToggleAlwaysListening}
          disabled={isProcessing}
          className={`w-14 h-14 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group ${
            isAlwaysListening
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-xl shadow-green-500/40'
              : 'bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 shadow-lg hover:shadow-xl hover:shadow-gray-500/30'
          }`}
          title={isAlwaysListening ? "Disable Always Listening" : "Enable Always Listening"}
        >
          <svg className="w-6 h-6 text-white mx-auto transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.636-.49-3.154-1.343-4.243a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Clear Conversation Button */}
        <button
          onClick={onClearConversation}
          disabled={isListening || isProcessing}
          className="w-14 h-14 rounded-xl bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 shadow-lg hover:shadow-xl hover:shadow-gray-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
          title="Clear Conversation"
        >
          <svg className="w-6 h-6 text-white mx-auto group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};
