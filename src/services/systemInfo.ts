interface SystemInfo {
  battery?: {
    level: number;
    charging: boolean;
  };
  network: {
    online: boolean;
    effectiveType?: string;
    downlink?: number;
  };
  performance: {
    memory?: number;
    cores?: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  time: {
    current: Date;
    timezone: string;
    locale: string;
  };
}

class SystemInfoService {
  private systemInfo: SystemInfo;

  constructor() {
    this.systemInfo = {
      network: {
        online: navigator.onLine
      },
      performance: {},
      time: {
        current: new Date(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language
      }
    };
    
    this.initializeSystemInfo();
    this.setupEventListeners();
  }

  private async initializeSystemInfo(): Promise<void> {
    // Battery API
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        this.systemInfo.battery = {
          level: Math.round(battery.level * 100),
          charging: battery.charging
        };
        
        // Listen for battery changes
        battery.addEventListener('levelchange', () => {
          if (this.systemInfo.battery) {
            this.systemInfo.battery.level = Math.round(battery.level * 100);
          }
        });
        
        battery.addEventListener('chargingchange', () => {
          if (this.systemInfo.battery) {
            this.systemInfo.battery.charging = battery.charging;
          }
        });
      } catch (error) {
        console.log('Battery API not available');
      }
    }

    // Network Information API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.systemInfo.network.effectiveType = connection.effectiveType;
      this.systemInfo.network.downlink = connection.downlink;
    }

    // Performance API
    if ('hardwareConcurrency' in navigator) {
      this.systemInfo.performance.cores = navigator.hardwareConcurrency;
    }

    if ('memory' in (performance as any)) {
      this.systemInfo.performance.memory = Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024);
    }
  }

  private setupEventListeners(): void {
    // Network status
    window.addEventListener('online', () => {
      this.systemInfo.network.online = true;
    });

    window.addEventListener('offline', () => {
      this.systemInfo.network.online = false;
    });

    // Update time every minute
    setInterval(() => {
      this.systemInfo.time.current = new Date();
    }, 60000);
  }

  async requestLocation(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          this.systemInfo.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // Try to get city name using reverse geocoding
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=id`
            );
            const data = await response.json();
            if (data.city) {
              this.systemInfo.location.city = data.city;
            }
          } catch (error) {
            console.log('Could not get city name');
          }

          resolve(true);
        },
        () => resolve(false),
        { timeout: 10000 }
      );
    });
  }

  getSystemStatus(): string {
    const status: string[] = [];
    
    // Battery status
    if (this.systemInfo.battery) {
      const batteryEmoji = this.systemInfo.battery.charging ? '🔌' : 
                          this.systemInfo.battery.level > 50 ? '🔋' : 
                          this.systemInfo.battery.level > 20 ? '🪫' : '🔴';
      status.push(`${batteryEmoji} Baterai: ${this.systemInfo.battery.level}%${this.systemInfo.battery.charging ? ' (Charging)' : ''}`);
    }

    // Network status
    const networkEmoji = this.systemInfo.network.online ? '🌐' : '📵';
    let networkText = `${networkEmoji} Jaringan: ${this.systemInfo.network.online ? 'Online' : 'Offline'}`;
    if (this.systemInfo.network.effectiveType) {
      networkText += ` (${this.systemInfo.network.effectiveType.toUpperCase()})`;
    }
    status.push(networkText);

    // Performance info
    if (this.systemInfo.performance.cores) {
      status.push(`⚡ CPU: ${this.systemInfo.performance.cores} cores`);
    }
    
    if (this.systemInfo.performance.memory) {
      status.push(`💾 Memory: ${this.systemInfo.performance.memory}MB`);
    }

    // Time and location
    const timeStr = this.systemInfo.time.current.toLocaleTimeString('id-ID');
    const dateStr = this.systemInfo.time.current.toLocaleDateString('id-ID');
    status.push(`🕐 Waktu: ${timeStr}, ${dateStr}`);
    
    if (this.systemInfo.location?.city) {
      status.push(`📍 Lokasi: ${this.systemInfo.location.city}`);
    }

    return status.join('\n');
  }

  getCurrentTime(): string {
    return this.systemInfo.time.current.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getCurrentDate(): string {
    return this.systemInfo.time.current.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getBatteryStatus(): string {
    if (!this.systemInfo.battery) {
      return 'Informasi baterai tidak tersedia';
    }

    const { level, charging } = this.systemInfo.battery;
    let status = `Baterai: ${level}%`;
    
    if (charging) {
      status += ' (Sedang mengisi daya)';
    } else if (level <= 20) {
      status += ' (Baterai lemah!)';
    } else if (level <= 50) {
      status += ' (Baterai sedang)';
    } else {
      status += ' (Baterai baik)';
    }

    return status;
  }

  getNetworkStatus(): string {
    const { online, effectiveType, downlink } = this.systemInfo.network;
    
    if (!online) {
      return 'Jaringan: Offline';
    }

    let status = 'Jaringan: Online';
    if (effectiveType) {
      status += ` (${effectiveType.toUpperCase()})`;
    }
    if (downlink) {
      status += ` - ${downlink} Mbps`;
    }

    return status;
  }

  async getWeatherInfo(): Promise<string> {
    if (!this.systemInfo.location) {
      return 'Lokasi tidak tersedia. Aktifkan GPS untuk info cuaca.';
    }

    try {
      // Using a free weather API (OpenWeatherMap alternative)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${this.systemInfo.location.latitude}&longitude=${this.systemInfo.location.longitude}&current_weather=true&timezone=auto`
      );
      
      const data = await response.json();
      const weather = data.current_weather;
      
      const weatherCodes: Record<number, string> = {
        0: '☀️ Cerah',
        1: '🌤️ Cerah sebagian',
        2: '⛅ Berawan sebagian',
        3: '☁️ Berawan',
        45: '🌫️ Berkabut',
        48: '🌫️ Berkabut tebal',
        51: '🌦️ Gerimis ringan',
        53: '🌦️ Gerimis sedang',
        55: '🌦️ Gerimis lebat',
        61: '🌧️ Hujan ringan',
        63: '🌧️ Hujan sedang',
        65: '🌧️ Hujan lebat',
        80: '🌦️ Hujan shower ringan',
        81: '🌦️ Hujan shower sedang',
        82: '🌦️ Hujan shower lebat'
      };

      const weatherDesc = weatherCodes[weather.weathercode] || '🌤️ Cuaca tidak diketahui';
      const temp = Math.round(weather.temperature);
      const windSpeed = Math.round(weather.windspeed);

      return `${weatherDesc}\n🌡️ Suhu: ${temp}°C\n💨 Angin: ${windSpeed} km/h`;
    } catch (error) {
      return 'Tidak dapat mengambil info cuaca saat ini.';
    }
  }

  getSystemInfo(): SystemInfo {
    return { ...this.systemInfo };
  }
}

export const systemInfo = new SystemInfoService();
