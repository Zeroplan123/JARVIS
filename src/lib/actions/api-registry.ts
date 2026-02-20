/**
 * Modular API Registry System for JARVIS
 * Allows easy addition of new services and APIs
 */

export interface APIService {
  name: string;
  displayName: string;
  description: string;
  patterns: string[]; // Voice command patterns
  handler: (query?: string, params?: Record<string, any>) => Promise<void> | void;
  requiresQuery?: boolean;
  category: 'search' | 'entertainment' | 'productivity' | 'social' | 'utility';
}

export interface APIResponse {
  success: boolean;
  message: string;
  url?: string;
  data?: any;
}

export class APIRegistry {
  private services = new Map<string, APIService>();
  private aliases = new Map<string, string>(); // alias -> service name

  constructor() {
    this.registerDefaultServices();
  }

  /**
   * Register a new API service
   */
  register(service: APIService): void {
    this.services.set(service.name, service);
    
    // Register patterns as aliases
    service.patterns.forEach(pattern => {
      this.aliases.set(pattern.toLowerCase(), service.name);
    });

    console.log(`[APIRegistry] Registered service: ${service.name}`);
  }

  /**
   * Find service by name or pattern
   */
  findService(query: string): APIService | null {
    const normalizedQuery = query.toLowerCase();
    
    // Direct name match
    if (this.services.has(normalizedQuery)) {
      return this.services.get(normalizedQuery)!;
    }

    // Pattern match
    const serviceName = this.aliases.get(normalizedQuery);
    if (serviceName) {
      return this.services.get(serviceName)!;
    }

    // Fuzzy pattern matching
    for (const [pattern, name] of this.aliases.entries()) {
      if (normalizedQuery.includes(pattern) || pattern.includes(normalizedQuery)) {
        return this.services.get(name)!;
      }
    }

    return null;
  }

  /**
   * Execute a service by name
   */
  async execute(serviceName: string, query?: string, params?: Record<string, any>): Promise<APIResponse> {
    const service = this.services.get(serviceName);
    if (!service) {
      return {
        success: false,
        message: `Service '${serviceName}' not found`
      };
    }

    if (service.requiresQuery && !query) {
      return {
        success: false,
        message: `Service '${serviceName}' requires a query parameter`
      };
    }

    try {
      await service.handler(query, params);
      return {
        success: true,
        message: `Successfully executed ${service.displayName}`,
        data: { service: service.name, query, params }
      };
    } catch (error) {
      console.error(`[APIRegistry] Error executing ${serviceName}:`, error);
      return {
        success: false,
        message: `Failed to execute ${service.displayName}: ${error}`
      };
    }
  }

  /**
   * Get all registered services
   */
  getAllServices(): APIService[] {
    return Array.from(this.services.values());
  }

  /**
   * Get services by category
   */
  getServicesByCategory(category: APIService['category']): APIService[] {
    return Array.from(this.services.values()).filter(s => s.category === category);
  }

  /**
   * Register default services
   */
  private registerDefaultServices(): void {
    // YouTube service
    this.register({
      name: 'youtube',
      displayName: 'YouTube',
      description: 'Search and open YouTube videos',
      patterns: ['youtube', 'yt', 'video', 'tonton'],
      category: 'entertainment',
      handler: (query?: string) => {
        const encodedQuery = query ? encodeURIComponent(query) : '';
        const url = query 
          ? `https://www.youtube.com/results?search_query=${encodedQuery}`
          : 'https://www.youtube.com/';
        window.open(url, '_blank');
      }
    });

    // Google service
    this.register({
      name: 'google',
      displayName: 'Google Search',
      description: 'Search on Google',
      patterns: ['google', 'cari', 'search'],
      category: 'search',
      requiresQuery: true,
      handler: (query?: string) => {
        if (!query) return;
        const encodedQuery = encodeURIComponent(query);
        const url = `https://www.google.com/search?q=${encodedQuery}`;
        window.open(url, '_blank');
      }
    });

    // Spotify service
    this.register({
      name: 'spotify',
      displayName: 'Spotify',
      description: 'Search music on Spotify',
      patterns: ['spotify', 'musik', 'lagu', 'music'],
      category: 'entertainment',
      handler: (query?: string) => {
        if (query) {
          const encodedQuery = encodeURIComponent(query);
          const url = `https://open.spotify.com/search/${encodedQuery}`;
          window.open(url, '_blank');
        } else {
          window.open('https://open.spotify.com/', '_blank');
        }
      }
    });

    // Instagram service
    this.register({
      name: 'instagram',
      displayName: 'Instagram',
      description: 'Open Instagram or search hashtags',
      patterns: ['instagram', 'ig', 'insta'],
      category: 'social',
      handler: (query?: string) => {
        if (query) {
          const encodedQuery = encodeURIComponent(query.replace('#', ''));
          window.open(`https://www.instagram.com/explore/tags/${encodedQuery}/`, '_blank');
        } else {
          window.open('https://www.instagram.com/', '_blank');
        }
      }
    });

    // Twitter/X service
    this.register({
      name: 'twitter',
      displayName: 'Twitter/X',
      description: 'Search on Twitter/X',
      patterns: ['twitter', 'x', 'tweet'],
      category: 'social',
      handler: (query?: string) => {
        if (query) {
          const encodedQuery = encodeURIComponent(query);
          window.open(`https://twitter.com/search?q=${encodedQuery}`, '_blank');
        } else {
          window.open('https://twitter.com/', '_blank');
        }
      }
    });

    // TikTok service
    this.register({
      name: 'tiktok',
      displayName: 'TikTok',
      description: 'Search on TikTok',
      patterns: ['tiktok', 'tik tok'],
      category: 'social',
      handler: (query?: string) => {
        if (query) {
          const encodedQuery = encodeURIComponent(query);
          window.open(`https://www.tiktok.com/search?q=${encodedQuery}`, '_blank');
        } else {
          window.open('https://www.tiktok.com/', '_blank');
        }
      }
    });

    // WhatsApp Web service
    this.register({
      name: 'whatsapp',
      displayName: 'WhatsApp Web',
      description: 'Open WhatsApp Web',
      patterns: ['whatsapp', 'wa', 'chat'],
      category: 'social',
      handler: () => {
        window.open('https://web.whatsapp.com/', '_blank');
      }
    });

    // Gmail service
    this.register({
      name: 'gmail',
      displayName: 'Gmail',
      description: 'Open Gmail',
      patterns: ['gmail', 'email', 'mail'],
      category: 'productivity',
      handler: () => {
        window.open('https://mail.google.com/', '_blank');
      }
    });

    // GitHub service
    this.register({
      name: 'github',
      displayName: 'GitHub',
      description: 'Search repositories on GitHub',
      patterns: ['github', 'git', 'repo', 'repository'],
      category: 'productivity',
      handler: (query?: string) => {
        if (query) {
          const encodedQuery = encodeURIComponent(query);
          window.open(`https://github.com/search?q=${encodedQuery}`, '_blank');
        } else {
          window.open('https://github.com/', '_blank');
        }
      }
    });

    // Netflix service
    this.register({
      name: 'netflix',
      displayName: 'Netflix',
      description: 'Open Netflix',
      patterns: ['netflix', 'film', 'movie'],
      category: 'entertainment',
      handler: () => {
        window.open('https://www.netflix.com/', '_blank');
      }
    });
  }
}

// Global registry instance
export const apiRegistry = new APIRegistry();

// Helper function to add custom services
export function addCustomService(service: APIService): void {
  apiRegistry.register(service);
}

// Helper function to execute service
export async function executeService(serviceName: string, query?: string, params?: Record<string, any>): Promise<APIResponse> {
  return apiRegistry.execute(serviceName, query, params);
}
