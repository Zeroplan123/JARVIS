interface ConversationContext {
  userId: string;
  sessionId: string;
  conversationHistory: Array<{
    timestamp: Date;
    userInput: string;
    jarvisResponse: string;
    context?: string;
  }>;
  userPreferences: {
    name?: string;
    preferredLanguage: string;
    voiceSettings: {
      speed: number;
      pitch: number;
      volume: number;
    };
    personality: 'formal' | 'casual' | 'friendly' | 'professional';
  };
  systemInfo: {
    lastActiveTime: Date;
    totalInteractions: number;
    favoriteTopics: string[];
  };
}

class ConversationMemoryService {
  private context: ConversationContext;
  private readonly STORAGE_KEY = 'jarvis_conversation_memory';
  private readonly MAX_HISTORY_LENGTH = 50;

  constructor() {
    this.context = this.loadFromStorage() || this.createDefaultContext();
    this.generateSessionId();
  }

  private createDefaultContext(): ConversationContext {
    return {
      userId: this.generateUserId(),
      sessionId: '',
      conversationHistory: [],
      userPreferences: {
        preferredLanguage: 'id-ID',
        voiceSettings: {
          speed: 0.85,
          pitch: 0.9,
          volume: 0.9
        },
        personality: 'friendly'
      },
      systemInfo: {
        lastActiveTime: new Date(),
        totalInteractions: 0,
        favoriteTopics: []
      }
    };
  }

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private generateSessionId(): void {
    this.context.sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private loadFromStorage(): ConversationContext | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.systemInfo.lastActiveTime = new Date(parsed.systemInfo.lastActiveTime);
        parsed.conversationHistory = parsed.conversationHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        return parsed;
      }
    } catch (error) {
      console.error('Error loading conversation memory:', error);
    }
    return null;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.context));
    } catch (error) {
      console.error('Error saving conversation memory:', error);
    }
  }

  addConversation(userInput: string, jarvisResponse: string, context?: string): void {
    const conversation = {
      timestamp: new Date(),
      userInput,
      jarvisResponse,
      context
    };

    this.context.conversationHistory.unshift(conversation);
    
    // Keep only recent conversations
    if (this.context.conversationHistory.length > this.MAX_HISTORY_LENGTH) {
      this.context.conversationHistory = this.context.conversationHistory.slice(0, this.MAX_HISTORY_LENGTH);
    }

    this.context.systemInfo.totalInteractions++;
    this.context.systemInfo.lastActiveTime = new Date();
    
    // Extract and update favorite topics
    this.updateFavoriteTopics(userInput);
    
    this.saveToStorage();
  }

  private updateFavoriteTopics(userInput: string): void {
    const topics = this.extractTopics(userInput);
    topics.forEach(topic => {
      const existingIndex = this.context.systemInfo.favoriteTopics.indexOf(topic);
      if (existingIndex > -1) {
        // Move to front if already exists
        this.context.systemInfo.favoriteTopics.splice(existingIndex, 1);
      }
      this.context.systemInfo.favoriteTopics.unshift(topic);
    });
    
    // Keep only top 10 topics
    this.context.systemInfo.favoriteTopics = this.context.systemInfo.favoriteTopics.slice(0, 10);
  }

  private extractTopics(input: string): string[] {
    const topics: string[] = [];
    const lowerInput = input.toLowerCase();
    
    // Define topic keywords
    const topicMap: Record<string, string[]> = {
      'teknologi': ['teknologi', 'komputer', 'software', 'programming', 'coding', 'ai', 'artificial intelligence'],
      'cuaca': ['cuaca', 'weather', 'hujan', 'panas', 'dingin', 'iklim'],
      'waktu': ['waktu', 'jam', 'time', 'tanggal', 'date', 'hari', 'bulan'],
      'musik': ['musik', 'lagu', 'song', 'music', 'band', 'artist'],
      'olahraga': ['olahraga', 'sport', 'sepak bola', 'basket', 'tennis'],
      'makanan': ['makanan', 'makan', 'food', 'resep', 'masak', 'restoran'],
      'travel': ['travel', 'liburan', 'vacation', 'wisata', 'jalan-jalan'],
      'kesehatan': ['kesehatan', 'health', 'sakit', 'dokter', 'obat', 'vitamin']
    };

    Object.entries(topicMap).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        topics.push(topic);
      }
    });

    return topics;
  }

  getRecentConversations(limit: number = 5): Array<{timestamp: Date, userInput: string, jarvisResponse: string}> {
    return this.context.conversationHistory.slice(0, limit);
  }

  getUserName(): string | undefined {
    return this.context.userPreferences.name;
  }

  setUserName(name: string): void {
    this.context.userPreferences.name = name;
    this.saveToStorage();
  }

  getPersonality(): string {
    return this.context.userPreferences.personality;
  }

  setPersonality(personality: 'formal' | 'casual' | 'friendly' | 'professional'): void {
    this.context.userPreferences.personality = personality;
    this.saveToStorage();
  }

  getVoiceSettings() {
    return this.context.userPreferences.voiceSettings;
  }

  updateVoiceSettings(settings: Partial<{speed: number, pitch: number, volume: number}>): void {
    this.context.userPreferences.voiceSettings = {
      ...this.context.userPreferences.voiceSettings,
      ...settings
    };
    this.saveToStorage();
  }

  getContextForAI(): string {
    const recentChats = this.getRecentConversations(3);
    const userName = this.getUserName();
    const personality = this.getPersonality();
    const favoriteTopics = this.context.systemInfo.favoriteTopics.slice(0, 3);
    const totalInteractions = this.context.systemInfo.totalInteractions;

    let contextString = `Context untuk JARVIS:\n`;
    
    if (userName) {
      contextString += `- Nama user: ${userName}\n`;
    }
    
    contextString += `- Personality mode: ${personality}\n`;
    contextString += `- Total interaksi: ${totalInteractions}\n`;
    
    if (favoriteTopics.length > 0) {
      contextString += `- Topik favorit user: ${favoriteTopics.join(', ')}\n`;
    }

    if (recentChats.length > 0) {
      contextString += `- Percakapan terakhir:\n`;
      recentChats.reverse().forEach((chat, index) => {
        contextString += `  ${index + 1}. User: "${chat.userInput}" | JARVIS: "${chat.jarvisResponse}"\n`;
      });
    }

    return contextString;
  }

  getStats() {
    return {
      totalInteractions: this.context.systemInfo.totalInteractions,
      conversationCount: this.context.conversationHistory.length,
      favoriteTopics: this.context.systemInfo.favoriteTopics,
      lastActiveTime: this.context.systemInfo.lastActiveTime,
      sessionId: this.context.sessionId
    };
  }

  clearHistory(): void {
    this.context.conversationHistory = [];
    this.context.systemInfo.favoriteTopics = [];
    this.generateSessionId();
    this.saveToStorage();
  }

  exportConversations(): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalInteractions: this.context.systemInfo.totalInteractions,
      conversations: this.context.conversationHistory.map(conv => ({
        timestamp: conv.timestamp.toISOString(),
        userInput: conv.userInput,
        jarvisResponse: conv.jarvisResponse
      }))
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}

export const conversationMemory = new ConversationMemoryService();
