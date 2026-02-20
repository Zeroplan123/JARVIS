export interface Intent {
  type: string;
  query?: string;
  confidence: number;
  entities?: Record<string, any>;
}

export interface IntentConfig {
  intents: Record<string, {
    patterns: string[];
    action: string;
    entities?: Record<string, string>;
  }>;
}

export class IntentParser {
  private config: IntentConfig;

  constructor(config?: IntentConfig) {
    this.config = config || {
      intents: {
        open_youtube: {
          patterns: ['buka youtube', 'youtube', 'putar youtube'],
          action: 'youtube',
          entities: { platform: 'youtube' }
        },
        search_google: {
          patterns: ['cari di google', 'google', 'search'],
          action: 'google', 
          entities: { platform: 'google' }
        },
        play_spotify: {
          patterns: ['putar lagu di spotify', 'spotify', 'musik spotify'],
          action: 'spotify',
          entities: { platform: 'spotify' }
        },
        open_instagram: {
          patterns: ['buka instagram', 'instagram'],
          action: 'instagram'
        },
        open_whatsapp: {
          patterns: ['buka whatsapp', 'whatsapp'],
          action: 'whatsapp'
        },
        open_gmail: {
          patterns: ['buka gmail', 'gmail'],
          action: 'gmail'
        },
        search_github: {
          patterns: ['cari repository di github', 'github'],
          action: 'github'
        },
        get_time: {
          patterns: ['jam berapa', 'sekarang jam berapa', 'tanggal'],
          action: 'get_time'
        },
        weather: {
          patterns: ['cuaca', 'prakiraan cuaca'],
          action: 'get_weather'
        }
      }
    };
  }

  parse(text: string): Intent {
    const lowerText = text.toLowerCase().trim();
    
    // Remove wake word if present
    const cleanText = lowerText.replace(/^jarvis\s*/, '');
    
    for (const [, intentData] of Object.entries(this.config.intents)) {
      for (const pattern of intentData.patterns) {
        if (cleanText.includes(pattern)) {
          // Extract query after the pattern
          const query = this.extractQuery(cleanText, pattern);
          
          return {
            type: intentData.action,
            query,
            confidence: this.calculateConfidence(cleanText, pattern),
            entities: intentData.entities
          };
        }
      }
    }
    
    return {
      type: 'unknown',
      confidence: 0.1
    };
  }

  private extractQuery(text: string, pattern: string): string | undefined {
    const patternIndex = text.indexOf(pattern);
    if (patternIndex === -1) return undefined;
    
    const afterPattern = text.substring(patternIndex + pattern.length).trim();
    
    // Remove common query prefixes
    const cleanQuery = afterPattern
      .replace(/^(cari|search|putar|mainkan)\s+/i, '')
      .replace(/^(di|dari)\s+/i, '')
      .trim();
    
    return cleanQuery || undefined;
  }

  private calculateConfidence(text: string, pattern: string): number {
    // Simple confidence calculation based on text similarity
    if (text === pattern) return 1.0;
    if (text.startsWith(pattern)) return 0.9;
    if (text.includes(pattern)) return 0.8;
    return 0.6;
  }

  addIntent(name: string, patterns: string[], action: string, entities?: Record<string, string>): void {
    this.config.intents[name] = {
      patterns,
      action,
      entities
    };
  }

  removeIntent(name: string): void {
    delete this.config.intents[name];
  }

  getIntents(): string[] {
    return Object.keys(this.config.intents);
  }
}

export const intentParser = new IntentParser();
