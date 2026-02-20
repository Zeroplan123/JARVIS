import { useCallback, useState, useEffect } from 'react';
import type { VoiceSettings } from '../types/jarvis';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const defaultSettings: VoiceSettings = {
    lang: 'id-ID',
    rate: 0.85,
    pitch: 0.9,
    volume: 0.9
  };

  const speak = useCallback((text: string, settings: Partial<VoiceSettings> = {}) => {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech not supported');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const finalSettings = { ...defaultSettings, ...settings };

    utterance.lang = finalSettings.lang;
    utterance.rate = finalSettings.rate;
    utterance.pitch = finalSettings.pitch;
    utterance.volume = finalSettings.volume;

    // Set up event listeners for speaking state
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    // Wait for voices to load if not already loaded
    const setVoice = () => {
      const voices = speechSynthesis.getVoices();
      
      // Try to find Indonesian voice first
      let preferredVoice = voices.find(voice => 
        voice.lang.includes('id') || voice.lang.includes('ID')
      );
      
      // If no Indonesian voice, try to find a natural sounding English voice
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.toLowerCase().includes('natural') || 
           voice.name.toLowerCase().includes('neural') ||
           voice.name.toLowerCase().includes('enhanced') ||
           voice.name.toLowerCase().includes('premium'))
        );
      }
      
      // Fallback to any male voice
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('male') || 
          voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('mark')
        );
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    };

    // Set voice immediately if voices are loaded
    if (speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      // Wait for voices to load
      speechSynthesis.onvoiceschanged = () => {
        setVoice();
        speechSynthesis.onvoiceschanged = null;
      };
    }

    speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Listen for global speech synthesis events
  useEffect(() => {
    speechSynthesis.addEventListener('voiceschanged', () => {
      // Force update when voices change
    });

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', () => {});
    };
  }, []);

  return { speak, stop, isSpeaking };
};
