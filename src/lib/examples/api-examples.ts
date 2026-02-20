/**
 * Examples of how to add new API services to JARVIS
 * This file demonstrates the modular architecture for easy extension
 */

import { addCustomService, type APIService } from '../actions/api-registry';

/**
 * Example: Adding a new streaming service (Disney+)
 */
export function addDisneyPlusService(): void {
  const disneyPlusService: APIService = {
    name: 'disneyplus',
    displayName: 'Disney+',
    description: 'Open Disney+ streaming service',
    patterns: ['disney', 'disney plus', 'disneyplus'],
    category: 'entertainment',
    handler: (query?: string) => {
      if (query) {
        // Disney+ doesn't have direct search URLs, so open main site
        window.open('https://www.disneyplus.com/', '_blank');
      } else {
        window.open('https://www.disneyplus.com/', '_blank');
      }
    }
  };

  addCustomService(disneyPlusService);
  console.log('✅ Disney+ service added to JARVIS');
}

/**
 * Example: Adding a productivity service (Notion)
 */
export function addNotionService(): void {
  const notionService: APIService = {
    name: 'notion',
    displayName: 'Notion',
    description: 'Open Notion workspace or search',
    patterns: ['notion', 'notes', 'workspace'],
    category: 'productivity',
    handler: (query?: string) => {
      if (query) {
        // Notion search (requires login)
        window.open(`https://www.notion.so/search?q=${encodeURIComponent(query)}`, '_blank');
      } else {
        window.open('https://www.notion.so/', '_blank');
      }
    }
  };

  addCustomService(notionService);
  console.log('✅ Notion service added to JARVIS');
}

/**
 * Example: Adding a social media service (LinkedIn)
 */
export function addLinkedInService(): void {
  const linkedInService: APIService = {
    name: 'linkedin',
    displayName: 'LinkedIn',
    description: 'Open LinkedIn or search for people/companies',
    patterns: ['linkedin', 'professional', 'network'],
    category: 'social',
    handler: (query?: string) => {
      if (query) {
        const encodedQuery = encodeURIComponent(query);
        window.open(`https://www.linkedin.com/search/results/all/?keywords=${encodedQuery}`, '_blank');
      } else {
        window.open('https://www.linkedin.com/', '_blank');
      }
    }
  };

  addCustomService(linkedInService);
  console.log('✅ LinkedIn service added to JARVIS');
}

/**
 * Example: Adding a local application launcher (VS Code)
 */
export function addVSCodeService(): void {
  const vscodeService: APIService = {
    name: 'vscode',
    displayName: 'VS Code',
    description: 'Open VS Code (if installed) or VS Code web',
    patterns: ['vscode', 'code', 'editor', 'ide'],
    category: 'productivity',
    handler: (_query?: string) => {
      try {
        // Try to open VS Code protocol (works if VS Code is installed)
        window.open('vscode://', '_blank');
      } catch (error) {
        // Fallback to VS Code web
        console.log('VS Code not installed, opening web version');
        window.open('https://vscode.dev/', '_blank');
      }
    }
  };

  addCustomService(vscodeService);
  console.log('✅ VS Code service added to JARVIS');
}

/**
 * Example: Adding a weather service
 */
export function addWeatherService(): void {
  const weatherService: APIService = {
    name: 'weather',
    displayName: 'Weather',
    description: 'Check weather information',
    patterns: ['weather', 'cuaca', 'forecast'],
    category: 'utility',
    requiresQuery: false,
    handler: (query?: string) => {
      if (query) {
        // Search weather for specific location
        const encodedQuery = encodeURIComponent(`weather ${query}`);
        window.open(`https://www.google.com/search?q=${encodedQuery}`, '_blank');
      } else {
        // Default weather (user's location)
        window.open('https://weather.com/', '_blank');
      }
    }
  };

  addCustomService(weatherService);
  console.log('✅ Weather service added to JARVIS');
}

/**
 * Example: Adding a translation service
 */
export function addTranslateService(): void {
  const translateService: APIService = {
    name: 'translate',
    displayName: 'Google Translate',
    description: 'Translate text using Google Translate',
    patterns: ['translate', 'terjemah', 'translation'],
    category: 'utility',
    requiresQuery: true,
    handler: (query?: string) => {
      if (!query) return;
      
      const encodedQuery = encodeURIComponent(query);
      // Auto-detect source language, translate to Indonesian
      window.open(`https://translate.google.com/?sl=auto&tl=id&text=${encodedQuery}`, '_blank');
    }
  };

  addCustomService(translateService);
  console.log('✅ Translation service added to JARVIS');
}

/**
 * Initialize all example services
 * Call this function to add all example services to JARVIS
 */
export function initializeExampleServices(): void {
  console.log('🚀 Initializing example API services...');
  
  addDisneyPlusService();
  addNotionService();
  addLinkedInService();
  addVSCodeService();
  addWeatherService();
  addTranslateService();
  
  console.log('✅ All example services initialized!');
  console.log('📝 Voice commands you can now use:');
  console.log('  - "jarvis buka disney plus"');
  console.log('  - "jarvis buka notion"');
  console.log('  - "jarvis cari John Doe di linkedin"');
  console.log('  - "jarvis buka vscode"');
  console.log('  - "jarvis cek cuaca Jakarta"');
  console.log('  - "jarvis terjemah hello world"');
}

/**
 * Example of creating a custom API service with advanced features
 */
export function createAdvancedAPIService(): APIService {
  return {
    name: 'advanced-example',
    displayName: 'Advanced Example',
    description: 'Example of advanced API service with custom logic',
    patterns: ['advanced', 'example', 'demo'],
    category: 'utility',
    handler: async (query?: string, params?: Record<string, any>) => {
      console.log('🔧 Advanced service called with:', { query, params });
      
      // Example: Custom logic based on query
      if (query?.includes('search')) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      } else if (query?.includes('video')) {
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
      } else {
        // Default action
        window.open('https://example.com/', '_blank');
      }
      
      // Example: Log data for further processing (but don't return it)
      console.log('Advanced service executed successfully:', { query, timestamp: Date.now() });
    }
  };
}
