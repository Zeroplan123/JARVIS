import { useState, useCallback, useRef } from 'react';

export interface JarvisStatus {
  state: 'idle' | 'passive' | 'waking_up' | 'recording_cmd' | 'processing' | 'speaking' | 'error';
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  lastCommand?: string;
  lastResponse?: string;
  error?: string;
}

export interface WakeWordEvent {
  detected: boolean;
  confidence?: number;
  command?: string;
}

export const usePassiveWakeWord = () => {
  const [status, setStatus] = useState<JarvisStatus>({
    state: 'idle',
    isListening: false,
    isProcessing: false,
    isSpeaking: false
  });

  const [isEnabled, setIsEnabled] = useState(false);
  const debugInfoRef = useRef({
    wakeWordActive: false,
    sttActive: false,
    ttsActive: false,
    stateMachine: {
      cooldownRemaining: 0,
      isProcessingCommand: false
    }
  });

  const startPassiveListening = useCallback(() => {
    setIsEnabled(true);
    setStatus(prev => ({ ...prev, state: 'passive', isListening: true }));
    debugInfoRef.current.wakeWordActive = true;
  }, []);

  const stopPassiveListening = useCallback(() => {
    setIsEnabled(false);
    setStatus(prev => ({ ...prev, state: 'idle', isListening: false }));
    debugInfoRef.current.wakeWordActive = false;
  }, []);

  const getDebugInfo = useCallback(() => {
    return debugInfoRef.current;
  }, []);

  const handleWakeWord = useCallback((event: WakeWordEvent) => {
    if (event.detected) {
      setStatus(prev => ({ 
        ...prev, 
        state: 'waking_up',
        lastCommand: event.command 
      }));
      
      if (event.command) {
        // Process command directly
        setStatus(prev => ({ ...prev, state: 'processing', isProcessing: true }));
        setTimeout(() => {
          setStatus(prev => ({ 
            ...prev, 
            state: 'passive', 
            isProcessing: false,
            lastResponse: `Processed: ${event.command}`
          }));
        }, 1000);
      } else {
        // Start STT session
        setStatus(prev => ({ ...prev, state: 'recording_cmd' }));
        debugInfoRef.current.sttActive = true;
      }
    }
  }, []);

  return {
    status,
    isEnabled,
    startPassiveListening,
    stopPassiveListening,
    handleWakeWord,
    getDebugInfo
  };
};
