import { ObjectId } from 'mongodb';

export type MemeStyle = 'classic' | 'modern' | 'minimalist';

export type GenerationMode = 'ai-suggested' | 'custom';

export type GenerationStage = 'concept' | 'image' | 'video' | null;

export interface MemeConcept {
  caption: string;           // Max 100 characters
  punchline: string;         // Max 100 characters
  visualDescription: string; // For image generation
}

export interface MemeOutput {
  memeImage: string;         // HTTPS URL
  memeCaption: string;       // Caption text
  memeVideo?: string;        // Optional HTTPS URL
}

export interface GenerationError {
  stage: 'concept' | 'image' | 'video';
  message: string;
  retryable: boolean;
}

export interface MemeHistoryItem {
  id: string;
  userId: string;
  topic: string;
  style: MemeStyle;
  mode: GenerationMode;
  output: MemeOutput;
  timestamp: Date;
}

export interface GenerationRequest {
  mode: GenerationMode;
  topic: string;
  style: MemeStyle;
  generateVideo: boolean;
  userId: string;
}

export interface GenerationResponse {
  success: boolean;
  output?: MemeOutput;
  error?: GenerationError;
}

// MongoDB Schema
export interface MemeDocument {
  _id?: ObjectId;
  userId: string;              // User identifier
  mode: 'ai-suggested' | 'custom';
  topic: string;               // Original topic
  style: 'classic' | 'modern' | 'minimalist';
  concept: {
    caption: string;
    punchline: string;
    visualDescription: string;
  };
  output: {
    imageUrl: string;
    videoUrl?: string;
  };
  metadata: {
    generationTime: number;    // Milliseconds
    imageGenerationTime: number;
    videoGenerationTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
