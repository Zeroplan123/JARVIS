# 🤖 JARVIS AI Assistant

**Just A Rather Very Intelligent System** - Asisten AI berbasis suara yang terinspirasi dari film Iron Man, dibangun dengan React + TypeScript dan Google Gemini AI.

![JARVIS Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.2-purple)

## 📋 Deskripsi Proyek

JARVIS adalah aplikasi asisten AI yang dapat berinteraksi melalui suara dalam bahasa Indonesia. Aplikasi ini menggunakan Web Speech API untuk speech recognition dan text-to-speech, serta Google Gemini AI untuk menghasilkan respons yang cerdas dan natural.

### ✨ Fitur Utama

- **🎤 Speech Recognition**: Pengenalan suara dalam bahasa Indonesia menggunakan Web Speech API
- **🔊 Text-to-Speech**: Sintesis suara dengan preferensi suara natural
- **🤖 AI Integration**: Integrasi dengan Google Gemini AI untuk respons yang cerdas
- **💬 Real-time Chat**: Interface chat real-time dengan riwayat percakapan
- **🎨 Modern UI**: Desain futuristik dengan gradien biru-ungu dan animasi menarik
- **📱 Responsive Design**: Tampilan yang responsif untuk berbagai ukuran layar
- **⚡ Real-time Processing**: Pemrosesan suara dan respons AI secara langsung

### 🎯 Kepribadian JARVIS

- Menggunakan bahasa Indonesia yang natural dan santai
- Memanggil pengguna dengan "Boss", "Bos", atau "Kak"
- Gaya komunikasi yang friendly tapi tetap informatif
- Sesekali menggunakan humor ringan dan bahasa gaul yang wajar

## 🏗️ Arsitektur Aplikasi

### 📁 Struktur Proyek

```
src/
├── components/          # Komponen React utama
│   ├── ChatDisplay.tsx  # Tampilan percakapan chat
│   ├── StatusIndicator.tsx  # Indikator status sistem
│   └── VoiceControl.tsx # Kontrol suara dan tombol
├── hooks/              # Custom React hooks
│   ├── useSpeechRecognition.ts  # Hook untuk speech recognition
│   └── useTextToSpeech.ts       # Hook untuk text-to-speech
├── services/           # Layer service
│   └── geminiService.ts # Service untuk Google Gemini AI
├── types/              # Type definitions TypeScript
│   ├── jarvis.ts       # Interface utama aplikasi
│   └── speech.d.ts     # Type definitions untuk Speech API
├── App.tsx             # Komponen utama aplikasi
├── App.css             # Styling khusus aplikasi
└── main.tsx            # Entry point aplikasi
```

### 🔧 Teknologi yang Digunakan

- **Frontend Framework**: React 19.1.1 dengan TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: TailwindCSS 4.1.12 dengan custom gradients
- **Animation**: Framer Motion 12.23.12
- **AI Service**: Google Generative AI (@google/generative-ai)
- **Markdown**: Marked 16.2.1 untuk formatting pesan
- **Speech APIs**: Web Speech API (native browser)

## 🚀 Panduan Instalasi

### Prasyarat

- **Node.js** versi 18 atau lebih baru
- **npm** atau **yarn** package manager
- **Google Gemini API Key** (gratis dari Google AI Studio)
- **Browser modern** yang mendukung Web Speech API (Chrome, Edge, Safari)

### 📥 Langkah Instalasi

1. **Clone atau download proyek ini**
   ```bash
   git clone <repository-url>
   cd jarvis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy file .env.example ke .env
   cp .env.example .env
   ```

4. **Dapatkan Google Gemini API Key**
   - Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Buat API key baru (gratis)
   - Copy API key tersebut

5. **Konfigurasi API Key**
   Edit file `.env` dan masukkan API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

6. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```

7. **Buka browser**
   - Aplikasi akan berjalan di `http://localhost:5173`
   - Pastikan browser mengizinkan akses mikrofon

## 🎮 Cara Penggunaan

### 🎤 Menggunakan Voice Control

1. **Klik tombol mikrofon** di bagian bawah aplikasi
2. **Berbicara dalam bahasa Indonesia** setelah tombol berubah merah
3. **Tunggu JARVIS memproses** dan memberikan respons
4. **JARVIS akan berbicara kembali** dengan suara sintetis

### 💬 Fitur Chat

- **Riwayat percakapan** tersimpan selama sesi aktif
- **Markdown support** untuk formatting pesan yang lebih baik
- **Timestamp** pada setiap pesan
- **Auto-scroll** ke pesan terbaru
- **Clear conversation** untuk memulai percakapan baru

### 🔄 Status Indikator

- **🟢 ONLINE**: Terhubung dengan layanan AI
- **🔴 OFFLINE**: Tidak terhubung atau ada error
- **🎤 LISTENING**: Sedang mendengarkan input suara
- **⚙️ PROCESSING**: Sedang memproses permintaan

## 🛠️ Development

### 📜 Available Scripts

```bash
# Menjalankan development server
npm run dev

# Build untuk production
npm run build

# Preview build production
npm run preview

# Linting code
npm run lint
```

### 🏗️ Build untuk Production

```bash
# Build aplikasi
npm run build

# File hasil build akan ada di folder dist/
# Deploy folder dist/ ke hosting pilihan Anda
```

### 🔧 Konfigurasi

- **Vite Config**: `vite.config.ts`
- **TypeScript Config**: `tsconfig.json`, `tsconfig.app.json`
- **TailwindCSS Config**: `tailwind.config.js`
- **ESLint Config**: `eslint.config.js`

## 🌐 Browser Compatibility

### ✅ Fully Supported
- **Chrome** 25+ (Recommended)
- **Microsoft Edge** 79+
- **Safari** 14.1+

### ⚠️ Limited Support
- **Firefox**: Text-to-speech only (no speech recognition)
- **Mobile browsers**: Terbatas pada beberapa fitur

### 📱 Mobile Support
- Interface responsif untuk mobile
- Touch controls untuk semua fitur
- Optimized untuk layar kecil

## 🔐 Keamanan & Privacy

- **API Key**: Disimpan sebagai environment variable, tidak di-commit ke repository
- **Speech Data**: Tidak disimpan permanen, hanya diproses real-time
- **Chat History**: Tersimpan lokal di browser, tidak dikirim ke server
- **HTTPS Required**: Untuk fitur speech recognition di production

## ⚠️ Batasan API & Quota

### 📊 Google Gemini API Limits
- **Free Tier**: 50 requests per hari per model
- **Rate Limit**: 2 requests per menit
- **Reset**: Quota reset setiap hari pada pukul 00:00 UTC

### 🔄 Fallback Mode
Ketika quota API habis, JARVIS akan beralih ke **Offline Mode** dengan:
- Respons fallback yang cerdas berdasarkan konteks
- Tetap mempertahankan kepribadian JARVIS
- Fitur dasar seperti waktu dan sapaan tetap berfungsi
- Notifikasi yang jelas tentang status offline

## 🚨 Troubleshooting

### Masalah Umum

**1. "Quota exceeded" atau Error 429**
- Quota API Gemini sudah habis untuk hari ini
- JARVIS akan otomatis beralih ke offline mode
- Coba lagi besok atau upgrade ke paid plan
- Aplikasi tetap bisa digunakan dengan respons terbatas

**2. Speech Recognition tidak bekerja**
- Pastikan menggunakan HTTPS (required untuk speech API)
- Check izin mikrofon di browser
- Coba refresh halaman
- Gunakan Chrome atau Edge untuk hasil terbaik

**3. JARVIS tidak merespons**
- Periksa API key Google Gemini di file `.env`
- Check koneksi internet
- Lihat console browser untuk error messages

**4. Suara tidak keluar**
- Check volume sistem dan browser
- Pastikan tidak ada aplikasi lain yang menggunakan audio
- Coba browser yang berbeda

**5. Build error**
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### 🐛 Debug Mode

Untuk debugging, buka Developer Tools di browser dan check:
- Console untuk error messages
- Network tab untuk API calls
- Application tab untuk environment variables

## 📚 Dokumentasi API

### Gemini Service
```typescript
// Generate response dari user input
geminiService.generateResponse(userInput: string): Promise<string>

// Get welcome message random
geminiService.getWelcomeMessage(): Promise<string>
```

### Speech Hooks
```typescript
// Speech Recognition Hook
const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();

// Text-to-Speech Hook
const { speak, stop } = useTextToSpeech();
```

## 🤝 Contributing

Untuk berkontribusi pada proyek ini:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Proyek ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lengkap.

## 👨‍💻 Author

Dibuat dengan ❤️ menggunakan teknologi modern web development.

---

**Happy Coding! 🚀**

> "Sometimes you gotta run before you can walk." - Tony Stark
