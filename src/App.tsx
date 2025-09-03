import { useState, useEffect, useCallback } from 'react';
import type { Message, JarvisState } from './types/jarvis';
import { ChatDisplay } from './components/ChatDisplay';
import { VoiceControl } from './components/VoiceControl';
import { StatusIndicator } from './components/StatusIndicator';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { geminiService } from './services/geminiService';
import './App.css';

function App() {
  const [jarvisState, setJarvisState] = useState<JarvisState>({
    isListening: false,
    isProcessing: false,
    isConnected: true,
    messages: []
  });

  const { isListening, isAlwaysListening, transcript, wakeWordDetected, startListening, stopListening, toggleAlwaysListening, resetTranscript } = useSpeechRecognition();
  const { speak, stop: stopSpeaking } = useTextToSpeech();

  // Update listening state
  useEffect(() => {
    setJarvisState(prev => ({ ...prev, isListening }));
  }, [isListening]);

  // Process transcript when available (including wake word detection)
  useEffect(() => {
    if (transcript && !jarvisState.isProcessing && (wakeWordDetected || !isAlwaysListening)) {
      handleUserInput(transcript);
      resetTranscript();
    }
  }, [transcript, jarvisState.isProcessing, wakeWordDetected, isAlwaysListening]);

  // Welcome message on load
  useEffect(() => {
    const initializeJarvis = async () => {
      try {
        const welcomeMessage = await geminiService.getWelcomeMessage();
        const jarvisMessage: Message = {
          id: Date.now().toString(),
          role: 'jarvis',
          content: welcomeMessage,
          timestamp: new Date()
        };
        
        setJarvisState(prev => ({
          ...prev,
          messages: [jarvisMessage]
        }));

        // Speak welcome message after a short delay
        setTimeout(() => {
          speak(welcomeMessage);
        }, 1000);
      } catch (error) {
        console.error('Failed to initialize Jarvis:', error);
        setJarvisState(prev => ({ ...prev, isConnected: false }));
      }
    };

    initializeJarvis();
  }, []);

  const handleUserInput = useCallback(async (input: string) => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setJarvisState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true
    }));

    try {
      // Get AI response
      const aiResponse = await geminiService.generateResponse(input);
      
      const jarvisMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'jarvis',
        content: aiResponse,
        timestamp: new Date()
      };

      setJarvisState(prev => ({
        ...prev,
        messages: [...prev.messages, jarvisMessage],
        isProcessing: false
      }));

      // Speak the response
      speak(aiResponse);

    } catch (error) {
      console.error('Error processing user input:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'jarvis',
        content: "Maaf Boss, ada gangguan sistem nih. Coba lagi ya, pasti bisa kok!",
        timestamp: new Date()
      };

      setJarvisState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isProcessing: false
      }));
    }
  }, [speak]);

  const handleStartListening = useCallback(() => {
    stopSpeaking(); // Stop any ongoing speech
    startListening();
  }, [startListening, stopSpeaking]);

  const handleStopListening = useCallback(() => {
    stopListening();
  }, [stopListening]);

  const handleClearConversation = useCallback(async () => {
    stopSpeaking();
    stopListening();
    
    // Get a new welcome message
    const welcomeMessage = await geminiService.getWelcomeMessage();
    const jarvisMessage: Message = {
      id: Date.now().toString(),
      role: 'jarvis',
      content: welcomeMessage,
      timestamp: new Date()
    };

    setJarvisState(prev => ({
      ...prev,
      messages: [jarvisMessage],
      isProcessing: false
    }));

    speak(welcomeMessage);
  }, [speak, stopSpeaking, stopListening]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-800 p-4 md:p-8">
      {/* Main Container Card */}
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">J</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  JARVIS
                </h1>
                <p className="text-lg font-semibold text-gray-600">Just A Rather Very Intelligent System</p>
              </div>
            </div>
            
            <StatusIndicator
              isConnected={jarvisState.isConnected}
              isListening={jarvisState.isListening}
              isProcessing={jarvisState.isProcessing}
            />
          </div>
        </div>

        {/* Main Chat Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <ChatDisplay
              messages={jarvisState.messages}
              isProcessing={jarvisState.isProcessing}
            />
            
            <VoiceControl
              isListening={jarvisState.isListening}
              isAlwaysListening={isAlwaysListening}
              isProcessing={jarvisState.isProcessing}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
              onToggleAlwaysListening={toggleAlwaysListening}
              onClearConversation={handleClearConversation}
            />
          </div>
        </div>
      </div>

      {/* Subtle Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default App;
