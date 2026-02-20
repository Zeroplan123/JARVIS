export type JarvisState = 
  | 'idle'
  | 'passive'
  | 'waking_up'
  | 'recording_cmd'
  | 'processing'
  | 'speaking'
  | 'error';

export interface JarvisStateMachineConfig {
  cooldownMs?: number;
  maxCommandDurationMs?: number;
  maxProcessingTimeMs?: number;
  wakeUpDelayMs?: number;
}

export interface StateMachineCallbacks {
  onStateChange?: (newState: JarvisState, oldState: JarvisState) => void;
  onError?: (error: Error, state: JarvisState) => void;
}

export class JarvisStateMachine {
  private currentState: JarvisState = 'idle';
  private config: JarvisStateMachineConfig;
  private callbacks: StateMachineCallbacks = {};
  private cooldownTimer?: NodeJS.Timeout;
  private recordingTimer?: NodeJS.Timeout;
  private processingTimer?: NodeJS.Timeout;
  private wakeUpTimer?: NodeJS.Timeout;
  private isInitialized = false;
  private isProcessingWakeWord = false;

  constructor(config: JarvisStateMachineConfig = {}) {
    this.config = {
      cooldownMs: config.cooldownMs || 1500,
      maxCommandDurationMs: config.maxCommandDurationMs || 10000,
      maxProcessingTimeMs: config.maxProcessingTimeMs || 30000,
      wakeUpDelayMs: config.wakeUpDelayMs || 300
    };
  }

  getCurrentState(): JarvisState {
    return this.currentState;
  }

  transitionTo(newState: JarvisState): void {
    const oldState = this.currentState;
    
    try {
      this.currentState = newState;
      if (this.callbacks.onStateChange) {
        this.callbacks.onStateChange(newState, oldState);
      }
    } catch (error) {
      if (this.callbacks.onError) {
        this.callbacks.onError(error as Error, newState);
      }
    }
  }

  startPassive(): void {
    this.transitionTo('passive');
  }

  wakeUp(): void {
    this.transitionTo('waking_up');
  }

  startRecording(): void {
    this.transitionTo('recording_cmd');
    
    // Auto-stop recording after max time
    this.recordingTimer = setTimeout(() => {
      this.stopRecording();
    }, this.config.maxCommandDurationMs || 10000);
  }

  stopRecording(): void {
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
      this.recordingTimer = undefined;
    }
    this.transitionTo('processing');
  }

  startProcessing(): void {
    this.transitionTo('processing');
  }

  startSpeaking(): void {
    this.transitionTo('speaking');
  }

  complete(): void {
    this.startCooldown();
  }

  error(_errorMessage?: string): void {
    this.transitionTo('error');
  }

  private startCooldown(): void {
    this.transitionTo('idle');
    
    this.cooldownTimer = setTimeout(() => {
      this.transitionTo('passive');
    }, this.config.cooldownMs || 1500);
  }

  // Test-specific methods
  initialize(): void {
    this.isInitialized = true;
    this.transitionTo('passive');
  }

  setCallbacks(callbacks: StateMachineCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  onWakeWordDetected(): boolean {
    if (!this.isInitialized || this.isProcessingWakeWord) {
      return false;
    }

    if (this.currentState === 'passive') {
      this.isProcessingWakeWord = true;
      this.transitionTo('waking_up');
      
      // Auto transition to recording after delay
      this.wakeUpTimer = setTimeout(() => {
        this.transitionTo('recording_cmd');
      }, this.config.wakeUpDelayMs || 300);
      
      return true;
    }
    
    return false;
  }

  onCommandReceived(_command: string): void {
    // Handle command received
    this.transitionTo('processing');
  }

  onProcessingComplete(): void {
    this.transitionTo('speaking');
  }

  onSpeakingComplete(): void {
    this.isProcessingWakeWord = false;
    this.startCooldown();
  }

  isProcessing(): boolean {
    return ['processing', 'speaking'].includes(this.currentState);
  }

  isListening(): boolean {
    return ['passive', 'waking_up', 'recording_cmd'].includes(this.currentState);
  }

  canStartWakeWordDetection(): boolean {
    return this.currentState === 'idle' || this.currentState === 'passive';
  }

  destroy(): void {
    if (this.cooldownTimer) {
      clearTimeout(this.cooldownTimer);
    }
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
    }
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
    }
    if (this.wakeUpTimer) {
      clearTimeout(this.wakeUpTimer);
    }
    this.isInitialized = false;
    this.isProcessingWakeWord = false;
  }
}
