import { useState, useRef, useCallback, useEffect } from 'react';
import type { SpeechRecognitionEvent } from '../types/jarvis';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isAlwaysListening, setIsAlwaysListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<number | null>(null);

  const checkForWakeWord = useCallback((text: string): boolean => {
    const lowerText = text.toLowerCase();
    return lowerText.includes('jarvis') || lowerText.includes('jarvis');
  }, []);

  const startContinuousListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      
      // Check for wake word in the transcript
      if (checkForWakeWord(fullTranscript)) {
        setWakeWordDetected(true);
        // Extract command after wake word
        const jarvisIndex = fullTranscript.toLowerCase().indexOf('jarvis');
        const command = fullTranscript.substring(jarvisIndex + 6).trim();
        if (command) {
          setTranscript(command);
        } else {
          setTranscript('Halo JARVIS');
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        // Restart recognition after error
        if (isAlwaysListening && restartTimeoutRef.current === null) {
          restartTimeoutRef.current = window.setTimeout(() => {
            restartTimeoutRef.current = null;
            startContinuousListening();
          }, 1000);
        }
      }
    };

    recognition.onend = () => {
      // Auto-restart if always listening is enabled
      if (isAlwaysListening && restartTimeoutRef.current === null) {
        restartTimeoutRef.current = window.setTimeout(() => {
          restartTimeoutRef.current = null;
          startContinuousListening();
        }, 500);
      } else {
        setIsListening(false);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [isAlwaysListening, checkForWakeWord]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'id-ID';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    setIsListening(false);
    setIsAlwaysListening(false);
  }, []);

  const toggleAlwaysListening = useCallback(() => {
    if (isAlwaysListening) {
      // Stop always listening
      setIsAlwaysListening(false);
      stopListening();
    } else {
      // Start always listening
      setIsAlwaysListening(true);
      startContinuousListening();
    }
  }, [isAlwaysListening, stopListening, startContinuousListening]);

  // Reset wake word detection after transcript is processed
  useEffect(() => {
    if (wakeWordDetected && transcript) {
      const timer = setTimeout(() => {
        setWakeWordDetected(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [wakeWordDetected, transcript]);

  return {
    isListening,
    isAlwaysListening,
    transcript,
    wakeWordDetected,
    startListening,
    stopListening,
    toggleAlwaysListening,
    resetTranscript: () => setTranscript('')
  };
};
