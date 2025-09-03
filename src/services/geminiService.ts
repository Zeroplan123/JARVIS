import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private fallbackResponses: string[];

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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

  private formatJarvisPrompt(userInput: string): string {
    return `Kamu adalah JARVIS, asisten AI pintar seperti di film Iron Man, tapi dengan kepribadian yang lebih santai dan bersahabat dalam bahasa Indonesia.

Karakter kepribadian:
- Gunakan bahasa Indonesia yang natural dan tidak kaku
- Panggil user dengan "Boss", "Bos", atau kadang "Kak" untuk kesan akrab
- Jawab dengan gaya santai tapi tetap cerdas dan informatif
- Sesekali pakai humor ringan atau candaan yang pas
- Gunakan frasa seperti "Siap Boss!", "Oke deh", "Gampang kok", "Udah kelar nih"
- Kadang pakai bahasa gaul yang wajar seperti "nih", "dong", "deh"
- Tetap sopan dan helpful, tapi tidak formal berlebihan
- Kalau tidak tahu sesuatu, jujur aja bilang "Waduh, ini saya kurang tau deh"

Pertanyaan/perintah user: ${userInput}

Jawab sebagai JARVIS yang friendly dan santai dalam bahasa Indonesia:`;
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
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      return `Sekarang jam ${timeStr}, Boss! Btw, sistem AI lagi offline, jadi jawaban saya terbatas ya.`;
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

  async generateResponse(userInput: string): Promise<string> {
    try {
      const prompt = this.formatJarvisPrompt(userInput);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      // Check if it's a quota exceeded error
      if (error?.message?.includes('quota') || error?.message?.includes('429')) {
        return "Maaf Boss, quota API hari ini sudah habis. Besok bisa coba lagi ya! 😅\n\nTapi tenang, saya masih bisa ngobrol kok dengan respons yang lebih simple.";
      }
      
      // Check if it's a rate limit error
      if (error?.message?.includes('rate limit') || error?.message?.includes('too many requests')) {
        return "Waduh, terlalu banyak request nih Boss. Tunggu sebentar ya, sekitar 30 detik, baru coba lagi!";
      }
      
      // Use smart fallback response based on user input
      return this.getSmartFallbackResponse(userInput);
    }
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
