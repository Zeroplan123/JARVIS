import { GoogleGenerativeAI } from '@google/generative-ai';
import { conversationMemory } from './conversationMemory';
import { systemInfo } from './systemInfo';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private fallbackResponses: string[];
  private modelNames = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-pro',
    'gemini-pro-vision'
  ];

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Diagnose API on initialization and update model list
    this.diagnoseAPI().then(result => {
      if (!result.valid) {
        console.error('❌ Gemini API Error:', result.error);
        console.warn('🤖 JARVIS will work with fallback responses only.');
        console.log('💡 To get a working API key, visit: https://makersuite.google.com/app/apikey');
      } else {
        console.log('✅ Gemini API is valid.');
        console.log(`📋 Available models: ${result.availableModels.length}`);
        console.log(`🚀 Working models: ${result.workingModels.length}`);
        
        if (result.workingModels.length > 0) {
          // Update model names to only working models
          this.modelNames = [...result.workingModels];
          console.log('🎯 Using working models:', this.modelNames);
        } else {
          console.warn('⚠️ No working models found. Using fallback responses only.');
        }
      }
    }).catch(err => {
      console.error('Failed to diagnose Gemini API:', err);
    });
    
    // Fallback responses when API is unavailable
    this.fallbackResponses = [
      "Maaf Boss, sistem AI sedang maintenance nih. Tapi saya tetap di sini untuk menemani!",
      "Waduh, koneksi ke server AI lagi gangguan. Coba tanya yang lain deh, atau tunggu sebentar ya!",
      "Sistem AI lagi overload Boss. Mungkin bisa coba lagi nanti? Atau tanya hal yang lebih simple dulu.",
      "Sorry Kak, server AI lagi penuh. Tapi saya masih bisa ngobrol kok, cuma jawaban saya lebih terbatas aja.",
      "Hmm, sepertinya quota API hari ini udah habis. Besok bisa coba lagi deh Boss!",
      "Lagi ada gangguan teknis nih. Tapi tenang, besok pasti udah normal lagi!",
      "API limit tercapai untuk hari ini. Maaf ya Boss, coba besok lagi ya!"
    ];
  }

  private getRuntimeDateContext(): string {
    const now = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `Waktu sistem saat ini:
- ISO: ${now.toISOString()}
- Local: ${now.toString()}
- Timezone: ${timeZone}`;
  }

  private formatJarvisPrompt(userInput: string): string {
    const context = conversationMemory.getContextForAI();
    const personality = conversationMemory.getPersonality();
    const userName = conversationMemory.getUserName();
    const runtimeDateContext = this.getRuntimeDateContext();
    
    let personalityInstructions = '';
    switch (personality) {
      case 'formal':
        personalityInstructions = 'Gunakan bahasa formal dan sopan, panggil dengan "Tuan/Nyonya"';
        break;
      case 'professional':
        personalityInstructions = 'Gunakan bahasa profesional tapi tetap ramah, panggil dengan "Sir/Madam"';
        break;
      case 'casual':
        personalityInstructions = 'Gunakan bahasa santai dan gaul, panggil dengan "Bro/Sis"';
        break;
      default: // friendly
        personalityInstructions = 'Gunakan bahasa Indonesia yang natural dan bersahabat, panggil dengan "Boss/Bos/Kak"';
    }

    return `Kamu adalah JARVIS, asisten AI pintar seperti di film Iron Man dengan kepribadian yang dapat disesuaikan.

${context}

${runtimeDateContext}

Karakter kepribadian saat ini: ${personality}
${personalityInstructions}

Instruksi umum:
- Jawab dengan gaya yang sesuai personality mode
- Sesekali pakai humor ringan yang pas
- Gunakan frasa seperti "Siap!", "Oke deh", "Gampang kok"
- Tetap sopan dan helpful
- Kalau tidak tahu sesuatu, jujur saja
- Jika user bertanya tanggal/jam/hari ini, gunakan "Waktu sistem saat ini" di atas dan jangan mengarang tanggal
- Ingat percakapan sebelumnya dan gunakan konteks tersebut
- Jika user menyebutkan nama, ingat dan gunakan nama tersebut
${userName ? `- Nama user adalah ${userName}` : ''}

Pertanyaan/perintah user: ${userInput}

Jawab sebagai JARVIS dengan personality ${personality}:`;
  }

  private getRandomFallbackResponse(): string {
    return this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
  }

  private getSmartFallbackResponse(userInput: string): string {
    const input = userInput.toLowerCase();
    
    // Greeting responses
    if (input.includes('halo') || input.includes('hai') || input.includes('hello')) {
      return "Halo juga Boss! Maaf nih, sistem AI lagi maintenance. Tapi saya masih bisa ngobrol simple kok!";
    }
    
    // Time-related questions
    if (input.includes('jam') || input.includes('waktu') || input.includes('time')) {
      const timeStr = systemInfo.getCurrentTime();
      const dateStr = systemInfo.getCurrentDate();
      return `Sekarang jam ${timeStr}, ${dateStr}. Btw, sistem AI lagi offline, jadi jawaban saya terbatas ya.`;
    }
    
    // System status questions
    if (input.includes('status') || input.includes('sistem') || input.includes('baterai') || input.includes('battery')) {
      const status = systemInfo.getSystemStatus();
      return `Status sistem saat ini:\n\n${status}\n\nSistem AI lagi maintenance, tapi info sistem masih bisa saya kasih!`;
    }
    
    // Weather questions
    if (input.includes('cuaca') || input.includes('weather') || input.includes('hujan')) {
      return "Waduh Boss, untuk info cuaca saya perlu akses internet yang full. Sistem AI lagi gangguan nih. Coba cek aplikasi cuaca di HP deh!";
    }
    
    // How are you questions
    if (input.includes('apa kabar') || input.includes('gimana') || input.includes('how are you')) {
      return "Saya baik-baik aja kok Boss! Cuma sistem AI lagi maintenance, jadi agak 'lemot' dikit. Tapi semangat tetap tinggi! 😄";
    }
    
    // Thank you responses
    if (input.includes('terima kasih') || input.includes('thanks') || input.includes('makasih')) {
      return "Sama-sama Boss! Senang bisa bantu, meski sistem AI lagi terbatas. Semoga besok udah normal lagi ya!";
    }
    
    // Goodbye responses
    if (input.includes('bye') || input.includes('dadah') || input.includes('selamat tinggal')) {
      return "Dadah Boss! Sampai ketemu lagi ya. Semoga besok sistem AI udah normal dan bisa ngobrol lebih seru! 👋";
    }
    
    // Questions about JARVIS itself
    if (input.includes('jarvis') || input.includes('kamu') || input.includes('siapa')) {
      return "Saya JARVIS, asisten AI Anda! Biasanya saya lebih pinter, tapi lagi ada gangguan sistem nih. Jadi jawaban saya agak terbatas dulu ya Boss!";
    }
    
    // Default fallback with context-aware response
    return this.getRandomFallbackResponse();
  }

  async diagnoseAPI(): Promise<{ valid: boolean; availableModels: string[]; workingModels: string[]; error?: string }> {
    try {
      // Test API key validity by listing models
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${import.meta.env.VITE_GEMINI_API_KEY}`);
      
      if (!response.ok) {
        return {
          valid: false,
          availableModels: [],
          workingModels: [],
          error: `API Key Error: ${response.status} - ${response.statusText}. Please check your API key at https://makersuite.google.com/app/apikey`
        };
      }
      
      const data = await response.json();
      const allModels = data.models?.map((model: any) => model.name) || [];
      
      // Filter for text generation models that support generateContent
      const textModels = allModels.filter((modelName: string) => 
        modelName.includes('gemini') && 
        !modelName.includes('vision') && 
        !modelName.includes('embedding')
      );
      
      // Extract model names (remove "models/" prefix)
      const modelNames = textModels.map((fullName: string) => fullName.split('/').pop()).filter(Boolean);
      
      // Skip testing due to CORS issues - assume common models work
      const workingModels = modelNames.filter((name: string) => 
        name.includes('1.5') || name.includes('pro') || name.includes('flash')
      );
      
      return {
        valid: true,
        availableModels: modelNames,
        workingModels
      };
    } catch (error: any) {
      return {
        valid: false,
        availableModels: [],
        workingModels: [],
        error: `Network Error: ${error.message}. Check your internet connection.`
      };
    }
  }

  async generateResponse(userInput: string): Promise<string> {
    let lastError: any = null;
    
    // Try each model in order
    for (const modelName of this.modelNames) {
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const prompt = this.formatJarvisPrompt(userInput);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = response.text();
        
        // Save conversation to memory
        conversationMemory.addConversation(userInput, aiResponse);
        
        return aiResponse;
      } catch (error: any) {
        lastError = error;
        console.warn(`Failed with model ${modelName}:`, error.message);
        continue; // Try next model
      }
    }
    
    // All models failed, use fallback
    console.error('All Gemini models failed, last error:', lastError);
    const fallbackResponse = this.getSmartFallbackResponse(userInput);
    conversationMemory.addConversation(userInput, fallbackResponse, 'fallback');
    return fallbackResponse;
  }

  async getWelcomeMessage(): Promise<string> {
    const welcomePrompts = [
      "Halo Boss! JARVIS siap membantu nih. Ada yang bisa saya kerjakan?",
      "Selamat datang kembali! Sistem udah ready, tinggal bilang aja mau ngapain.",
      "Hai Kak! JARVIS online dan siap action. Mau dibantu apa hari ini?",
      "Yo Boss! Semua sistem normal, tinggal kasih perintah deh.",
      "Halo! JARVIS di sini, siap melayani dengan senang hati nih!"
    ];
    
    const randomWelcome = welcomePrompts[Math.floor(Math.random() * welcomePrompts.length)];
    return randomWelcome;
  }
}

export const geminiService = new GeminiService();

// Export diagnostic function for manual testing
export const diagnoseGeminiAPI = () => geminiService.diagnoseAPI();
