import { useState, useEffect, useCallback } from 'react';
import { ChatDisplay } from './components/ChatDisplay';
import { VoiceControl } from './components/VoiceControl';
import { StatusIndicator } from './components/StatusIndicator';
import { SettingsPanel } from './components/SettingsPanel';
import { GoogleConnectPanel } from './components/GoogleConnectPanel';
import { CommandPanel } from './components/CommandPanel';
import { CalendarPanel } from './components/CalendarPanel';
import { EmailPanel } from './components/EmailPanel';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { geminiService } from './services/geminiService';
import type { JarvisState, Message } from './types/jarvis';

function App() {
  const [jarvisState, setJarvisState] = useState<JarvisState>({
    isListening: false,
    isProcessing: false,
    isConnected: true,
    messages: []
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [activeThreadId, setActiveThreadId] = useState('primary');
  const [mode, setMode] = useState<'assistant' | 'chat'>('assistant');

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
    
    // Get a new welcome message with current personality
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

  const handleSubmitComposer = useCallback(async () => {
    const text = composerText.trim();
    if (!text) return;
    setComposerText('');
    await handleUserInput(text);
  }, [composerText, handleUserInput]);

  const threads = [
    { id: 'primary', title: 'Primary Session' },
    { id: 'research', title: 'Research' },
    { id: 'planning', title: 'Planning' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <header className="col-span-12 flex items-center justify-between border border-[var(--stroke-1)] bg-[var(--bg-1)] px-5 py-4" style={{ borderRadius: 'var(--r-2)' }}>
            <div className="min-w-0">
              <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">JARVIS</div>
              <div className="text-base font-semibold tracking-[-0.01em]">Intelligence Console</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[var(--stroke-1)]" style={{ borderRadius: 'var(--r-1)' }}>
                <button
                  onClick={() => setMode('assistant')}
                  className="h-9 px-3 text-sm font-medium"
                  style={{
                    borderTopLeftRadius: 'var(--r-1)',
                    borderBottomLeftRadius: 'var(--r-1)',
                    background: mode === 'assistant' ? 'rgba(255,255,255,0.04)' : 'transparent',
                    color: mode === 'assistant' ? 'var(--text-1)' : 'var(--text-2)',
                    borderRight: '1px solid var(--stroke-1)'
                  }}
                >
                  Assistant
                </button>
                <button
                  onClick={() => setMode('chat')}
                  className="h-9 px-3 text-sm font-medium"
                  style={{
                    borderTopRightRadius: 'var(--r-1)',
                    borderBottomRightRadius: 'var(--r-1)',
                    background: mode === 'chat' ? 'rgba(255,255,255,0.04)' : 'transparent',
                    color: mode === 'chat' ? 'var(--text-1)' : 'var(--text-2)'
                  }}
                >
                  Chat
                </button>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] bg-transparent text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)]"
                style={{ borderRadius: 'var(--r-1)' }}
              >
                Settings
              </button>
              <StatusIndicator
                isConnected={jarvisState.isConnected}
                isListening={jarvisState.isListening}
                isProcessing={jarvisState.isProcessing}
              />
            </div>
          </header>

          <aside className="col-span-12 md:col-span-4 lg:col-span-3 border border-[var(--stroke-1)] bg-[var(--bg-1)]" style={{ borderRadius: 'var(--r-2)' }}>
            <div className="px-5 py-4 border-b border-[var(--stroke-1)]">
              <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">SESSIONS</div>
            </div>
            <div className="p-2">
              {threads.map((t) => {
                const active = t.id === activeThreadId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className="w-full text-left px-4 py-3 border border-transparent hover:border-[var(--stroke-1)]"
                    style={{ borderRadius: 'var(--r-1)', background: active ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                  >
                    <div className="text-sm font-medium text-[var(--text-1)]">{t.title}</div>
                    <div className="text-xs text-[var(--text-3)] mt-0.5">Thread ID: {t.id}</div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="col-span-12 md:col-span-8 lg:col-span-9 border border-[var(--stroke-1)] bg-[var(--bg-1)] flex flex-col" style={{ borderRadius: 'var(--r-2)', minHeight: 'calc(100vh - 132px)' }}>
            {mode === 'assistant' ? (
              <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5">
                <div className="mx-auto w-full max-w-[980px] space-y-4">
                  <GoogleConnectPanel />
                  <CommandPanel />
                  <CalendarPanel />
                  <EmailPanel />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 min-h-0">
                  <ChatDisplay
                    messages={jarvisState.messages}
                    isProcessing={jarvisState.isProcessing}
                  />
                </div>

                <div className="border-t border-[var(--stroke-1)] bg-[rgba(16,19,24,0.72)]" style={{ borderBottomLeftRadius: 'var(--r-2)', borderBottomRightRadius: 'var(--r-2)', backdropFilter: 'blur(10px)' }}>
                  <div className="px-5 py-4">
                    <div className="flex gap-3 items-end">
                      <textarea
                        value={composerText}
                        onChange={(e) => setComposerText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            void handleSubmitComposer();
                          }
                        }}
                        placeholder="Type a message…"
                        className="flex-1 min-h-[48px] max-h-40 resize-none px-4 py-3 text-sm border border-[var(--stroke-1)] bg-[var(--bg-2)] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none"
                        style={{ borderRadius: 'var(--r-1)', boxShadow: '0 0 0 0 rgba(0,0,0,0)' }}
                      />
                      <button
                        onClick={() => void handleSubmitComposer()}
                        disabled={jarvisState.isProcessing}
                        className="h-12 px-4 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderRadius: 'var(--r-1)' }}
                      >
                        Send
                      </button>
                    </div>
                    <div className="mt-3">
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
              </>
            )}
          </main>
        </div>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
