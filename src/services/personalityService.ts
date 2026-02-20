export interface Personality {
  name: string;
  greeting: string;
  style: string;
}

export class PersonalityService {
  private currentPersonality: Personality = {
    name: 'default',
    greeting: 'Halo Boss! Saya JARVIS, asisten virtual Anda.',
    style: 'friendly'
  };

  private personalities: Record<string, Personality> = {
    default: {
      name: 'default',
      greeting: 'Halo Boss! Saya JARVIS, asisten virtual Anda.',
      style: 'friendly'
    },
    professional: {
      name: 'professional',
      greeting: 'Selamat datang. Saya JARVIS, asisten virtual Anda.',
      style: 'formal'
    },
    casual: {
      name: 'casual',
      greeting: 'Halo! Saya JARVIS, siap membantu Anda.',
      style: 'relaxed'
    },
    humorous: {
      name: 'humorous',
      greeting: 'Halo Boss! JARVIS siap action dengan gaya kece!',
      style: 'funny'
    }
  };

  setPersonality(personalityName: string): void {
    if (this.personalities[personalityName]) {
      this.currentPersonality = this.personalities[personalityName];
    }
  }

  getPersonality(): Personality {
    return this.currentPersonality;
  }

  getGreeting(): string {
    return this.currentPersonality.greeting;
  }

  getStyle(): string {
    return this.currentPersonality.style;
  }

  getAvailablePersonalities(): string[] {
    return Object.keys(this.personalities);
  }
}

export const personalityService = new PersonalityService();
