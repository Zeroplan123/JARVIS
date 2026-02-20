import { useState, useEffect } from 'react';
import { conversationMemory } from '../services/conversationMemory';

interface VoicePersonalitySelectorProps {
  onPersonalityChange?: (personality: 'formal' | 'casual' | 'friendly' | 'professional') => void;
}

export const VoicePersonalitySelector: React.FC<VoicePersonalitySelectorProps> = ({ onPersonalityChange }) => {
  const [selectedPersonality, setSelectedPersonality] = useState(conversationMemory.getPersonality());
  const [isExpanded, setIsExpanded] = useState(false);

  const personalities = [
    {
      value: 'friendly' as const,
      label: '😊 Ramah',
      description: 'Boss/Kak - Santai dan bersahabat',
      color: 'from-green-400 to-emerald-500',
      example: '"Halo Boss! Ada yang bisa saya bantu hari ini?"'
    },
    {
      value: 'formal' as const,
      label: '🎩 Formal',
      description: 'Tuan/Nyonya - Sopan dan hormat',
      color: 'from-blue-400 to-indigo-500',
      example: '"Selamat pagi, Tuan. Bagaimana saya dapat membantu Anda?"'
    },
    {
      value: 'professional' as const,
      label: '💼 Profesional',
      description: 'Sir/Madam - Bisnis dan efisien',
      color: 'from-purple-400 to-violet-500',
      example: '"Good morning, Sir. How may I assist you today?"'
    },
    {
      value: 'casual' as const,
      label: '😎 Santai',
      description: 'Bro/Sis - Rileks dan fun',
      color: 'from-orange-400 to-red-500',
      example: '"Yo Bro! What\'s up? Need any help?"'
    }
  ];

  const currentPersonality = personalities.find(p => p.value === selectedPersonality);

  const handlePersonalityChange = (personality: 'formal' | 'casual' | 'friendly' | 'professional') => {
    setSelectedPersonality(personality);
    conversationMemory.setPersonality(personality);
    onPersonalityChange?.(personality);
    setIsExpanded(false);
  };

  useEffect(() => {
    setSelectedPersonality(conversationMemory.getPersonality());
  }, []);

  return (
    <div className="relative">
      {/* Current Selection Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 rounded-xl bg-gradient-to-r ${currentPersonality?.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="font-semibold text-lg">{currentPersonality?.label}</div>
            <div className="text-sm opacity-90">{currentPersonality?.description}</div>
          </div>
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Options */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {personalities.map((personality) => (
            <button
              key={personality.value}
              onClick={() => handlePersonalityChange(personality.value)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                selectedPersonality === personality.value ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${personality.color} mt-1.5 flex-shrink-0`}></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{personality.label}</div>
                  <div className="text-sm text-gray-600 mb-1">{personality.description}</div>
                  <div className="text-xs text-gray-500 italic">{personality.example}</div>
                </div>
                {selectedPersonality === personality.value && (
                  <svg className="w-5 h-5 text-blue-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
          
          {/* Preview Section */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-700 mb-2">Preview Respons:</div>
            <div className="text-sm text-gray-600 italic bg-white p-3 rounded-lg border">
              {currentPersonality?.example}
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close when clicking outside */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};
