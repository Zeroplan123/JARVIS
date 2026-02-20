// Jest setup file for DOM testing

// Mock Web Speech API globally
const mockSpeechRecognition = {
  continuous: false,
  interimResults: false,
  lang: 'id-ID',
  maxAlternatives: 1,
  start: jest.fn(),
  stop: jest.fn(),
  onstart: null,
  onresult: null,
  onerror: null,
  onend: null,
};

// Mock SpeechRecognition constructor
const MockSpeechRecognition = jest.fn(() => mockSpeechRecognition);

// Add to global window object
if (typeof global.window === 'undefined') {
  Object.defineProperty(global, 'window', {
    value: {
      SpeechRecognition: MockSpeechRecognition,
      webkitSpeechRecognition: MockSpeechRecognition,
    },
    writable: true,
    configurable: true,
  });
} else {
  global.window.SpeechRecognition = MockSpeechRecognition;
  global.window.webkitSpeechRecognition = MockSpeechRecognition;
}

// Export for use in tests
export { mockSpeechRecognition, MockSpeechRecognition };
