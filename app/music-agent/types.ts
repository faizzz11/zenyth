export type MusicMood = 'romantic' | 'sad' | 'energetic' | 'aggressive' | 'nostalgic' | 'chill' | 'upbeat';
export type MusicTempo = 'slow' | 'medium' | 'fast';
export type MusicGenre = 'rap' | 'pop' | 'classical' | 'bollywood' | 'rock' | 'lofi' | 'jazz' | 'electronic' | 'folk';

export interface MusicGenerationRequest {
  mood: MusicMood;
  tempo: MusicTempo;
  bpm?: number;
  genre: MusicGenre;
  singerStyle?: string;
  freeTextPrompt?: string;
  userId: string;
}

export interface MusicGenerationResponse {
  success: boolean;
  output?: {
    audioUrl: string;
    styleReference: string;
    tempo: string;
    mood: string;
    genre: string;
    duration: number;
  };
  error?: {
    message: string;
    retryable: boolean;
  };
}

export interface MusicDocument {
  userId: string;
  mood: MusicMood;
  tempo: MusicTempo;
  bpm?: number;
  genre: MusicGenre;
  singerStyle?: string;
  prompt: string;
  output: {
    audioUrl: string;
    duration: number;
  };
  metadata: {
    generationTime: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicHistoryItem {
  id: string;
  userId: string;
  mood: MusicMood;
  tempo: MusicTempo;
  genre: MusicGenre;
  singerStyle?: string;
  prompt: string;
  output: {
    audioUrl: string;
    duration: number;
  };
  createdAt: Date;
}

