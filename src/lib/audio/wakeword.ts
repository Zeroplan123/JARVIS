export interface WakeWordEvent {
  detected: boolean;
  confidence?: number;
  command?: string;
  timestamp?: number;
}

export interface WakeWordConfig {
  wakeWord?: string;
  confidenceThreshold?: number;
  sensitivity?: number;
  onWakeWordDetected?: (event: WakeWordEvent) => void;
}

export class WakeWordDetector {
  public config: Required<WakeWordConfig>;
  private isListening: boolean = false;
  private audioContext?: AudioContext;
  private analyser?: AnalyserNode;

  constructor(config: WakeWordConfig = {}) {
    this.config = {
      wakeWord: config.wakeWord || 'jarvis',
      confidenceThreshold: config.confidenceThreshold || 0.7,
      sensitivity: config.sensitivity || 0.5,
      onWakeWordDetected: config.onWakeWordDetected || (() => {})
    };
  }

  async start(): Promise<void> {
    try {
      this.isListening = true;
      
      // Setup audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
      
      // Start detection loop
      this.detectLoop();
    } catch (error) {
      console.error('Failed to start wake word detection:', error);
      this.isListening = false;
    }
  }

  stop(): void {
    this.isListening = false;
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = undefined;
    }
  }

  private async detectLoop(): Promise<void> {
    while (this.isListening && this.analyser) {
      const detected = await this.analyzeAudio();
      
      if (detected) {
        const event: WakeWordEvent = {
          detected: true,
          confidence: Math.random() * 0.3 + 0.7, // Simulated confidence
          timestamp: Date.now()
        };
        
        this.config.onWakeWordDetected(event);
      }
      
      // Small delay to prevent CPU overload
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async analyzeAudio(): Promise<boolean> {
    if (!this.analyser) return false;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    
    // Simple energy-based detection (simplified)
    const energy = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    const threshold = this.config.sensitivity * 255;
    
    return energy > threshold;
  }

  extractCommandFromTranscript(transcript: string): string | null {
    const lowerTranscript = transcript.toLowerCase();
    const wakeWord = this.config.wakeWord.toLowerCase();
    
    if (lowerTranscript.startsWith(wakeWord)) {
      // Extract command after wake word
      const command = lowerTranscript.substring(wakeWord.length).trim();
      return command || null;
    }
    
    return null;
  }

  isActive(): boolean {
    return this.isListening;
  }

  updateConfig(config: Partial<WakeWordConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
