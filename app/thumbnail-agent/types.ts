export type VideoType = 
  | 'vlog' 
  | 'challenge' 
  | 'tech-review' 
  | 'reaction' 
  | 'finance' 
  | 'fitness' 
  | 'gaming'
  | 'educational'
  | 'entertainment';

export type ThumbnailStyle = 
  | 'dramatic-shock' 
  | 'clean-professional' 
  | 'cinematic-dark' 
  | 'bright-viral';

export interface ThumbnailGenerationRequest {
  faceImage: string; // base64 or URL
  additionalImages?: string[]; // base64 or URLs
  videoType?: VideoType;
  detailedInstructions?: string;
  userId: string;
}

export interface ThumbnailVariation {
  imageUrl: string;
  style: string;
  dominantColor: string;
  emotion: string;
}

export interface ThumbnailGenerationResponse {
  success: boolean;
  thumbnails?: ThumbnailVariation[];
  error?: {
    message: string;
    retryable: boolean;
  };
}

export interface ThumbnailDocument {
  userId: string;
  videoType?: VideoType;
  instructions?: string;
  thumbnails: ThumbnailVariation[];
  selectedThumbnail?: string;
  metadata: {
    generationTime: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
