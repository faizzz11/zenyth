# Design Document: MEME-AGENT

## Overview

The MEME-AGENT is a feature module for a multi-agent AI platform that enables social media creators to generate trending meme images and short videos. The system integrates three AI services: Gemini for concept generation, NanoBanana for image synthesis, and FFmpeg for video processing. The feature supports two operational modes: AI-suggested trending topics and custom user-defined topics.

### Design Goals

- Modular architecture with clear separation of concerns
- Seamless integration with existing Next.js application design system
- Type-safe implementation using TypeScript throughout
- Efficient API integration with retry logic and timeout handling
- Responsive UI that works across mobile, tablet, and desktop
- Accessibility-compliant interface (WCAG 2.1 Level AA)
- Performance-optimized generation pipeline (< 60 seconds total)

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (matching existing design system)
- **Fonts**: Inter (sans-serif), Instrument Serif (serif)
- **State Management**: React hooks (useState, useEffect)
- **API Layer**: Next.js Server Actions or API Routes
- **Database**: MongoDB for meme history storage
- **External Services**: Gemini API, NanoBanana API, FFmpeg

## Architecture

### High-Level Architecture

The MEME-AGENT follows a layered architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /app/meme-agent/page.tsx (Main UI)                  │  │
│  │  /app/meme-agent/components/* (UI Components)        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                      API/Action Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /app/meme-agent/api/generate/route.ts              │  │
│  │  /app/meme-agent/api/history/route.ts               │  │
│  │  OR Server Actions in actions.ts                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  memeConceptGenerator.ts (Gemini Integration)        │  │
│  │  memeImageGenerator.ts (NanoBanana Integration)      │  │
│  │  memeVideoGenerator.ts (FFmpeg Integration)          │  │
│  │  trendingTopicsService.ts (Trend Agent)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    Integration Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /lib/gemini.ts (Gemini API Client)                 │  │
│  │  /lib/nanobanana.ts (NanoBanana API Client)         │  │
│  │  /lib/ffmpeg.ts (FFmpeg Utilities)                  │  │
│  │  /lib/mongodb.ts (Database Client)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Gemini API  │  NanoBanana API  │  FFmpeg  │  MongoDB│  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
/app/meme-agent/
├── page.tsx                          # Main UI page
├── types.ts                          # TypeScript type definitions
├── components/
│   ├── ModeSelector.tsx              # AI/Custom mode toggle
│   ├── TrendingTopics.tsx            # Trending topics display
│   ├── CustomTopicInput.tsx          # Custom topic input field
│   ├── StyleSelector.tsx             # Meme style selector
│   ├── VideoToggle.tsx               # Video generation toggle
│   ├── GenerateButton.tsx            # Main generation trigger
│   ├── LoadingIndicator.tsx          # Loading states
│   ├── MemePreview.tsx               # Preview area for output
│   ├── DownloadButtons.tsx           # Download controls
│   └── ErrorMessage.tsx              # Error display
├── api/
│   ├── generate/
│   │   └── route.ts                  # Generation endpoint
│   └── history/
│       └── route.ts                  # History retrieval endpoint
└── services/
    ├── memeConceptGenerator.ts       # Gemini integration
    ├── memeImageGenerator.ts         # NanoBanana integration
    ├── memeVideoGenerator.ts         # FFmpeg integration
    └── trendingTopicsService.ts      # Trend agent integration

/lib/
├── gemini.ts                         # Shared Gemini client
├── nanobanana.ts                     # Shared NanoBanana client
├── ffmpeg.ts                         # Shared FFmpeg utilities
└── mongodb.ts                        # Shared MongoDB client
```

## Components and Interfaces

### UI Components

#### 1. ModeSelector Component

**Purpose**: Toggle between AI-suggested and custom topic modes

**Props**:
```typescript
interface ModeSelectorProps {
  mode: 'ai-suggested' | 'custom';
  onModeChange: (mode: 'ai-suggested' | 'custom') => void;
}
```

**Behavior**:
- Renders two-option toggle matching landing page design
- Persists selection in component state during session
- Triggers mode change callback on selection

#### 2. TrendingTopics Component

**Purpose**: Display and allow selection of trending topics

**Props**:
```typescript
interface TrendingTopicsProps {
  topics: string[];
  selectedTopic: string | null;
  onTopicSelect: (topic: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  error: string | null;
}
```

**Behavior**:
- Displays 3-10 trending topics in a grid layout
- Highlights selected topic
- Shows loading state during fetch
- Displays error message if service unavailable
- Provides refresh button for manual update

#### 3. CustomTopicInput Component

**Purpose**: Accept custom topic input from user

**Props**:
```typescript
interface CustomTopicInputProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}
```

**Behavior**:
- Text input with 3-200 character validation
- Real-time character count display
- Shows validation error below input
- Sanitizes input to prevent injection attacks

#### 4. StyleSelector Component

**Purpose**: Allow selection of meme visual style

**Props**:
```typescript
interface StyleSelectorProps {
  selectedStyle: MemeStyle;
  onStyleChange: (style: MemeStyle) => void;
}
```

**Behavior**:
- Displays three style options: Classic, Modern, Minimalist
- Visual indicator for selected style
- Default selection: Classic

#### 5. VideoToggle Component

**Purpose**: Enable/disable video generation

**Props**:
```typescript
interface VideoToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}
```

**Behavior**:
- Toggle switch component
- Default state: disabled
- Clear visual indication of state

#### 6. MemePreview Component

**Purpose**: Display generated meme output

**Props**:
```typescript
interface MemePreviewProps {
  output: MemeOutput | null;
  isLoading: boolean;
}
```

**Behavior**:
- Shows image preview with caption
- Shows video player if video available
- Displays loading state during generation
- Responsive layout for different screen sizes

#### 7. LoadingIndicator Component

**Purpose**: Show progress during generation pipeline

**Props**:
```typescript
interface LoadingIndicatorProps {
  stage: 'concept' | 'image' | 'video' | null;
}
```

**Behavior**:
- Displays descriptive text for current stage
- Animated spinner matching design system
- Disables generation controls during processing

#### 8. ErrorMessage Component

**Purpose**: Display user-friendly error messages

**Props**:
```typescript
interface ErrorMessageProps {
  error: GenerationError | null;
  onRetry: () => void;
}
```

**Behavior**:
- Shows error message with stage information
- Provides retry button
- Matches design system styling

### Type Definitions

```typescript
// types.ts

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
```

## Data Models

### MongoDB Schema

#### Meme Collection

```typescript
interface MemeDocument {
  _id: ObjectId;
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

// Indexes
db.memes.createIndex({ userId: 1, createdAt: -1 });
db.memes.createIndex({ createdAt: -1 });
db.memes.createIndex({ userId: 1, mode: 1 });
```

## API Route Design

### 1. Generate Meme Endpoint

**Route**: `POST /app/meme-agent/api/generate/route.ts`

**Request Body**:
```typescript
{
  mode: 'ai-suggested' | 'custom',
  topic: string,
  style: 'classic' | 'modern' | 'minimalist',
  generateVideo: boolean,
  userId: string
}
```

**Response**:
```typescript
{
  success: true,
  output: {
    memeImage: string,
    memeCaption: string,
    memeVideo?: string
  }
}
// OR
{
  success: false,
  error: {
    stage: 'concept' | 'image' | 'video',
    message: string,
    retryable: boolean
  }
}
```

**Flow**:
1. Validate request body
2. Call memeConceptGenerator service
3. Call memeImageGenerator service
4. If video enabled, call memeVideoGenerator service
5. Validate all URLs are accessible
6. Store result in MongoDB
7. Return response

**Timeout**: 60 seconds total

### 2. Get Meme History Endpoint

**Route**: `GET /app/meme-agent/api/history/route.ts`

**Query Parameters**:
```typescript
{
  userId: string,
  page?: number,      // Default: 1
  limit?: number      // Default: 20, Max: 50
}
```

**Response**:
```typescript
{
  success: true,
  data: MemeHistoryItem[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    hasMore: boolean
  }
}
```

### 3. Get Trending Topics Endpoint

**Route**: `GET /app/meme-agent/api/trending/route.ts`

**Response**:
```typescript
{
  success: true,
  topics: string[],    // 3-10 topics
  cachedAt: string     // ISO timestamp
}
// OR
{
  success: false,
  error: string
}
```

**Caching**: 5 minutes

## Service Layer Design

### 1. Meme Concept Generator Service

**File**: `services/memeConceptGenerator.ts`

**Function Signature**:
```typescript
async function generateMemeConcept(
  topic: string,
  style: MemeStyle
): Promise<MemeConcept>
```

**Implementation**:
- Uses Gemini API client from `/lib/gemini.ts`
- Constructs prompt with topic and style parameters
- Parses response into MemeConcept structure
- Validates caption/punchline length constraints
- Implements retry logic (3 attempts, exponential backoff)
- Timeout: 10 seconds

**Prompt Template**:
```
Generate a meme concept for the topic: "{topic}"
Style: {style}

Return a JSON object with:
- caption: A witty caption (max 100 characters)
- punchline: A humorous punchline (max 100 characters)
- visualDescription: A detailed description for image generation (2-3 sentences)

The meme should be appropriate for social media and match the {style} aesthetic.
```

### 2. Meme Image Generator Service

**File**: `services/memeImageGenerator.ts`

**Function Signature**:
```typescript
async function generateMemeImage(
  visualDescription: string
): Promise<string>
```

**Implementation**:
- Uses NanoBanana API client from `/lib/nanobanana.ts`
- Sends visual description as prompt
- Returns publicly accessible HTTPS URL
- Validates image resolution (min 800x600)
- Implements retry logic (3 attempts, exponential backoff)
- Timeout: 30 seconds

### 3. Meme Video Generator Service

**File**: `services/memeVideoGenerator.ts`

**Function Signature**:
```typescript
async function generateMemeVideo(
  imageUrl: string,
  caption: string,
  punchline: string
): Promise<string>
```

**Implementation**:
- Uses FFmpeg utilities from `/lib/ffmpeg.ts`
- Downloads image from URL
- Creates video with text overlays
- Caption: fade-in at 0s, display 0-3s
- Punchline: fade-in at 3s, display 3-6s
- Exports as MP4 (H.264 codec)
- Uploads to storage and returns URL
- Cleans up temporary files
- Timeout: 45 seconds

**FFmpeg Command Structure**:
```bash
ffmpeg -loop 1 -i input.jpg -vf "
  drawtext=text='CAPTION':fontsize=48:fontcolor=white:
    x=(w-text_w)/2:y=h-100:enable='between(t,0,3)':
    alpha='if(lt(t,0.5),t/0.5,if(lt(t,2.5),1,(3-t)/0.5))',
  drawtext=text='PUNCHLINE':fontsize=48:fontcolor=white:
    x=(w-text_w)/2:y=h-50:enable='between(t,3,6)':
    alpha='if(lt(t,3.5),(t-3)/0.5,if(lt(t,5.5),1,(6-t)/0.5))'
" -t 6 -c:v libx264 -pix_fmt yuv420p output.mp4
```

### 4. Trending Topics Service

**File**: `services/trendingTopicsService.ts`

**Function Signature**:
```typescript
async function getTrendingTopics(): Promise<string[]>
```

**Implementation**:
- Calls external Trend Agent API
- Returns 3-10 trending topics
- Implements caching (5 minutes)
- Fallback to default topics if service unavailable
- Timeout: 5 seconds

**Default Fallback Topics**:
```typescript
const DEFAULT_TOPICS = [
  "Monday motivation",
  "Weekend vibes",
  "Work from home",
  "Coffee addiction",
  "Procrastination",
  "Social media trends"
];
```

## Data Flow Diagrams

### Generation Pipeline Flow

```
User Action: Click Generate
         ↓
┌────────────────────────────────────────┐
│  1. Validate Input                     │
│     - Check topic length (3-200)      │
│     - Sanitize input                   │
│     - Verify user session              │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  2. Generate Concept (Gemini)          │
│     - Send topic + style to Gemini    │
│     - Parse response                   │
│     - Validate constraints             │
│     - Timeout: 10s                     │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  3. Generate Image (NanoBanana)        │
│     - Send visual description          │
│     - Receive image URL                │
│     - Validate URL accessibility       │
│     - Timeout: 30s                     │
└────────────────────────────────────────┘
         ↓
    [Video Enabled?]
         ↓ Yes
┌────────────────────────────────────────┐
│  4. Generate Video (FFmpeg)            │
│     - Download image                   │
│     - Add text overlays                │
│     - Export MP4                       │
│     - Upload and get URL               │
│     - Cleanup temp files               │
│     - Timeout: 45s                     │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  5. Store in MongoDB                   │
│     - Save meme document               │
│     - Include metadata                 │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  6. Return to Client                   │
│     - Send MemeOutput                  │
│     - Update UI                        │
└────────────────────────────────────────┘
```

### Error Handling Flow

```
Service Call
     ↓
[Success?] ──Yes──> Continue Pipeline
     ↓ No
[Retryable?]
     ↓ Yes
[Retry Count < 3?]
     ↓ Yes
Wait (Exponential Backoff)
     ↓
Retry Service Call
     ↓
[Success?] ──Yes──> Continue Pipeline
     ↓ No
Return Error to Client
     ↓
Display Error Message
     ↓
Show Retry Button
```


## Integration Layer

### Shared Library Structure

The integration layer provides reusable API clients and utilities that can be shared across features.

#### /lib/gemini.ts

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
  private client: GoogleGenerativeAI;
  private model: string = 'gemini-1.5-flash';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string, timeout: number = 10000): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.model });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateWithRetry(
    prompt: string,
    maxRetries: number = 3,
    timeout: number = 10000
  ): Promise<string> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.generateText(prompt, timeout);
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }
}

export function createGeminiClient(): GeminiClient {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GeminiClient(apiKey);
}
```

#### /lib/nanobanana.ts

```typescript
export class NanoBananaClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.nanobanana.com/v1';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('NanoBanana API key is required');
    }
    this.apiKey = apiKey;
  }

  async generateImage(
    prompt: string,
    timeout: number = 30000
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`NanoBanana API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.imageUrl;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateWithRetry(
    prompt: string,
    maxRetries: number = 3,
    timeout: number = 30000
  ): Promise<string> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.generateImage(prompt, timeout);
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }
}

export function createNanoBananaClient(): NanoBananaClient {
  const apiKey = process.env.NANOBANANA_API_KEY;
  if (!apiKey) {
    throw new Error('NANOBANANA_API_KEY environment variable is not set');
  }
  return new NanoBananaClient(apiKey);
}
```

#### /lib/ffmpeg.ts

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export class FFmpegService {
  async verifyInstallation(): Promise<boolean> {
    try {
      await execAsync('ffmpeg -version');
      return true;
    } catch {
      return false;
    }
  }

  async createMemeVideo(
    imageUrl: string,
    caption: string,
    punchline: string,
    outputPath: string
  ): Promise<string> {
    const isInstalled = await this.verifyInstallation();
    if (!isInstalled) {
      throw new Error('FFmpeg is not installed or not accessible');
    }

    const tempDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tempDir, { recursive: true });

    const tempImagePath = path.join(tempDir, `input-${Date.now()}.jpg`);
    const tempVideoPath = path.join(tempDir, `output-${Date.now()}.mp4`);

    try {
      // Download image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      await fs.writeFile(tempImagePath, Buffer.from(imageBuffer));

      // Escape special characters in text
      const escapedCaption = caption.replace(/'/g, "\\'").replace(/:/g, "\\:");
      const escapedPunchline = punchline.replace(/'/g, "\\'").replace(/:/g, "\\:");

      // Generate video with text overlays
      const command = `ffmpeg -loop 1 -i "${tempImagePath}" -vf "` +
        `drawtext=text='${escapedCaption}':fontsize=48:fontcolor=white:` +
        `x=(w-text_w)/2:y=h-100:enable='between(t,0,3)':` +
        `alpha='if(lt(t,0.5),t/0.5,if(lt(t,2.5),1,(3-t)/0.5))',` +
        `drawtext=text='${escapedPunchline}':fontsize=48:fontcolor=white:` +
        `x=(w-text_w)/2:y=h-50:enable='between(t,3,6)':` +
        `alpha='if(lt(t,3.5),(t-3)/0.5,if(lt(t,5.5),1,(6-t)/0.5))'` +
        `" -t 6 -c:v libx264 -pix_fmt yuv420p "${tempVideoPath}"`;

      await execAsync(command);

      // Move to final output location
      await fs.copyFile(tempVideoPath, outputPath);

      return outputPath;
    } finally {
      // Cleanup temporary files
      try {
        await fs.unlink(tempImagePath);
        await fs.unlink(tempVideoPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}

export function createFFmpegService(): FFmpegService {
  return new FFmpegService();
}
```

#### /lib/mongodb.ts

```typescript
import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME || 'meme-agent');

  // Create indexes
  await db.collection('memes').createIndex({ userId: 1, createdAt: -1 });
  await db.collection('memes').createIndex({ createdAt: -1 });

  return db;
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
```

## State Management Approach

The MEME-AGENT uses React hooks for local state management. No global state management library is required due to the feature's isolated nature.

### State Structure

```typescript
// Main page state
interface MemeAgentState {
  // Mode selection
  mode: GenerationMode;
  
  // Trending topics
  trendingTopics: string[];
  selectedTrendingTopic: string | null;
  trendingTopicsLoading: boolean;
  trendingTopicsError: string | null;
  
  // Custom topic
  customTopic: string;
  customTopicError: string | null;
  
  // Style selection
  selectedStyle: MemeStyle;
  
  // Video toggle
  videoEnabled: boolean;
  
  // Generation state
  isGenerating: boolean;
  generationStage: GenerationStage;
  
  // Output
  memeOutput: MemeOutput | null;
  
  // Error handling
  generationError: GenerationError | null;
  
  // History
  memeHistory: MemeHistoryItem[];
  historyLoading: boolean;
  historyPage: number;
  historyHasMore: boolean;
}
```

### State Management Pattern

```typescript
// Example: Main page component
'use client';

import { useState, useEffect } from 'react';

export default function MemeAgentPage() {
  // Mode state
  const [mode, setMode] = useState<GenerationMode>('ai-suggested');
  
  // Trending topics state
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [selectedTrendingTopic, setSelectedTrendingTopic] = useState<string | null>(null);
  const [trendingTopicsLoading, setTrendingTopicsLoading] = useState(false);
  
  // Custom topic state
  const [customTopic, setCustomTopic] = useState('');
  const [customTopicError, setCustomTopicError] = useState<string | null>(null);
  
  // Style state
  const [selectedStyle, setSelectedStyle] = useState<MemeStyle>('classic');
  
  // Video toggle state
  const [videoEnabled, setVideoEnabled] = useState(false);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<GenerationStage>(null);
  const [memeOutput, setMemeOutput] = useState<MemeOutput | null>(null);
  const [generationError, setGenerationError] = useState<GenerationError | null>(null);
  
  // Fetch trending topics on mount and when mode changes to AI
  useEffect(() => {
    if (mode === 'ai-suggested') {
      fetchTrendingTopics();
    }
  }, [mode]);
  
  // Handlers
  const handleGenerate = async () => {
    // Validation and generation logic
  };
  
  const handleRetry = async () => {
    // Retry logic
  };
  
  // ... rest of component
}
```

## Error Handling

### Error Types

```typescript
export enum ErrorType {
  VALIDATION = 'validation',
  CONFIGURATION = 'configuration',
  SERVICE = 'service',
  TIMEOUT = 'timeout',
  NETWORK = 'network',
}

export interface AppError {
  type: ErrorType;
  stage: 'concept' | 'image' | 'video' | 'storage' | null;
  message: string;
  retryable: boolean;
  details?: unknown;
}
```

### Error Handling Strategy

#### 1. Input Validation Errors

**Trigger**: Invalid user input (topic length, special characters)

**Handling**:
- Display inline validation error message
- Prevent form submission
- Highlight invalid field
- No retry needed (user must correct input)

#### 2. Configuration Errors

**Trigger**: Missing environment variables, FFmpeg not installed

**Handling**:
- Display configuration error message
- Log detailed error for debugging
- Provide setup instructions
- Not retryable (requires system configuration)

#### 3. Service Errors

**Trigger**: API failures (Gemini, NanoBanana, Trend Agent)

**Handling**:
- Automatic retry with exponential backoff (up to 3 attempts)
- Display user-friendly error message after retries exhausted
- Show retry button for manual retry
- Log error details for debugging

#### 4. Timeout Errors

**Trigger**: Service exceeds timeout threshold

**Handling**:
- Cancel request
- Display timeout error message
- Show retry button
- Log timeout occurrence

#### 5. Network Errors

**Trigger**: Connection failures, DNS errors

**Handling**:
- Automatic retry (up to 3 attempts)
- Display network error message
- Show retry button
- Suggest checking internet connection

### Error Recovery Flow

```typescript
async function handleServiceCall<T>(
  serviceCall: () => Promise<T>,
  stage: GenerationStage,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await serviceCall();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      if (!isRetryableError(error)) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new AppError({
    type: ErrorType.SERVICE,
    stage,
    message: `Failed after ${maxRetries} attempts`,
    retryable: true,
    details: lastError,
  });
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Network errors are retryable
    if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
      return true;
    }
    // Timeout errors are retryable
    if (error.message.includes('timeout') || error.message.includes('aborted')) {
      return true;
    }
    // 5xx server errors are retryable
    if (error.message.includes('500') || error.message.includes('503')) {
      return true;
    }
  }
  return false;
}
```

### User-Facing Error Messages

```typescript
const ERROR_MESSAGES = {
  VALIDATION: {
    TOPIC_TOO_SHORT: 'Topic must be at least 3 characters long',
    TOPIC_TOO_LONG: 'Topic must be no more than 200 characters',
    TOPIC_INVALID: 'Topic contains invalid characters',
  },
  CONFIGURATION: {
    MISSING_API_KEY: 'Service configuration error. Please contact support.',
    FFMPEG_NOT_INSTALLED: 'Video generation is currently unavailable.',
  },
  SERVICE: {
    CONCEPT_GENERATION_FAILED: 'Failed to generate meme concept. Please try again.',
    IMAGE_GENERATION_FAILED: 'Failed to generate meme image. Please try again.',
    VIDEO_GENERATION_FAILED: 'Failed to generate meme video. Image is still available.',
    TRENDING_TOPICS_FAILED: 'Unable to load trending topics. Try custom topic mode.',
  },
  TIMEOUT: {
    CONCEPT_TIMEOUT: 'Concept generation timed out. Please try again.',
    IMAGE_TIMEOUT: 'Image generation timed out. Please try again.',
    VIDEO_TIMEOUT: 'Video generation timed out. Image is still available.',
  },
  NETWORK: {
    CONNECTION_FAILED: 'Connection failed. Please check your internet connection.',
  },
};
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

Before defining the correctness properties, I performed a reflection to eliminate redundancy:

**Redundancies Identified**:
1. Properties 3.2 and 3.3 (min/max length validation) can be combined into a single range validation property
2. Properties 5.3 and 5.4 (video toggle behavior) can be combined into a single conditional output property
3. Properties 6.2 and 6.3 (caption and punchline length) can be combined into a single concept constraint property
4. Properties 7.3 and 16.6 (HTTPS URL validation) are redundant - one property covers all URL outputs
5. Properties 8.2 and 8.3 (caption and punchline overlays) can be combined into a single text overlay property
6. Properties 12.1, 12.2, and 12.3 (loading indicators per stage) can be combined into a single loading state property
7. Properties 14.1, 15.1, and 19.1/19.2 (API key reading) can be combined into a single configuration property
8. Properties 14.5 and 15.5 (retry logic) can be combined into a single retry behavior property
9. Properties 14.6 and 15.6 (service timeouts) can be combined with 6.7, 7.6, 8.8 into a single timeout property
10. Properties 23.1, 23.2, 23.4, 23.5, 23.6 (accessibility features) can be combined into comprehensive accessibility properties

**Consolidation Strategy**:
- Combine similar validation properties into range/constraint properties
- Merge conditional behavior properties that test the same mechanism
- Create comprehensive properties for cross-cutting concerns (timeouts, retries, accessibility)
- Keep properties that validate unique behaviors separate

### Property 1: Mode Selection Persistence

For any user session, when a mode (AI-suggested or custom) is selected, that mode should remain selected throughout all subsequent interactions until explicitly changed by the user.

**Validates: Requirements 1.5**

### Property 2: Mode-Specific UI Display

For any mode selection, when AI-suggested mode is active, trending topics should be displayed, and when custom mode is active, a text input field should be displayed.

**Validates: Requirements 1.2, 1.3**

### Property 3: Trending Topics Range

For any successful fetch of trending topics, the number of topics displayed should be between 3 and 10 inclusive.

**Validates: Requirements 2.2**

### Property 4: Topic Selection State

For any trending topic list, when a user selects a topic, that topic should be marked as selected and all other topics should be unselected.

**Validates: Requirements 2.4**

### Property 5: Custom Topic Validation

For any custom topic input, the input should be accepted if and only if its length is between 3 and 200 characters inclusive, and rejected with an error message otherwise.

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 6: Input Sanitization

For any custom topic input containing potentially malicious patterns (script tags, SQL injection attempts, XSS vectors), the sanitized output should not contain executable code or special characters that could cause injection attacks.

**Validates: Requirements 3.5**

### Property 7: Style Parameter Propagation

For any meme generation request, the selected style (classic, modern, or minimalist) should be included in the parameters sent to the Gemini service for concept generation.

**Validates: Requirements 4.4**

### Property 8: Conditional Video Output

For any meme generation request, when the video toggle is enabled, the output should include both memeImage and memeVideo properties, and when disabled, the output should include only the memeImage property.

**Validates: Requirements 5.3, 5.4, 9.4, 9.5**

### Property 9: Concept Structure Constraints

For any generated meme concept, the caption should not exceed 100 characters, the punchline should not exceed 100 characters, and the visual description should be non-empty.

**Validates: Requirements 6.2, 6.3, 6.4**

### Property 10: HTTPS URL Validation

For any meme output, all URLs (memeImage and memeVideo if present) should use the HTTPS protocol and should be accessible (return HTTP 200 status).

**Validates: Requirements 7.3, 9.6, 15.3, 16.6**

### Property 11: Image Resolution Requirement

For any generated meme image, the resolution should be at least 800x600 pixels.

**Validates: Requirements 7.4**

### Property 12: Video Format and Resolution

For any generated meme video, the file should be in MP4 format with H.264 codec, have a resolution of at least 800x600 pixels, and have a duration between 3 and 10 seconds inclusive.

**Validates: Requirements 8.4, 8.5, 8.6**

### Property 13: Video Text Overlay Presence

For any generated meme video, the video should contain both the caption text and the punchline text as overlays.

**Validates: Requirements 8.2, 8.3, 16.4, 16.5**

### Property 14: Output Structure Completeness

For any meme output, the object should contain memeImage (string URL) and memeCaption (string text) properties, and optionally memeVideo (string URL) if video generation was enabled.

**Validates: Requirements 9.1, 9.2, 9.3**

### Property 15: Preview Display Synchronization

For any meme output, when the output becomes available, the UI should display the image preview, the caption text below the image, and a video player with controls if memeVideo is present.

**Validates: Requirements 10.1, 10.2, 10.3**

### Property 16: Video Replay Capability

For any displayed meme video, the video player should allow the video to be played multiple times without requiring page reload or regeneration.

**Validates: Requirements 10.4**

### Property 17: Conditional Download Button Display

For any meme output, an image download button should always be present, and a video download button should be present if and only if memeVideo exists in the output.

**Validates: Requirements 11.2**

### Property 18: Download Action Triggering

For any download button click (image or video), the click should initiate a file download with the filename format "meme_[timestamp].[extension]" where extension is "jpg" for images and "mp4" for videos.

**Validates: Requirements 11.3, 11.4, 11.5**

### Property 19: Loading State Display

For any generation stage (concept, image, or video), while that stage is in progress, a loading indicator should be displayed with descriptive text indicating the current stage.

**Validates: Requirements 12.1, 12.2, 12.3, 12.4**

### Property 20: Control Disabling During Generation

For any active generation process, all generation controls (mode selector, topic input, style selector, video toggle, generate button) should be disabled until the generation completes or fails.

**Validates: Requirements 12.6**

### Property 21: Error Message Display with Stage Information

For any service failure (concept, image, or video generation), an error message should be displayed that includes which stage failed and provides a retry button.

**Validates: Requirements 13.1, 13.2, 13.3**

### Property 22: Retry Mechanism

For any failed operation with a retry button, clicking the retry button should attempt the failed operation again with the same parameters.

**Validates: Requirements 13.4**

### Property 23: Error Logging

For any error that occurs during generation, detailed error information (stage, message, stack trace) should be logged for debugging purposes.

**Validates: Requirements 13.5**

### Property 24: API Configuration from Environment

For any service initialization (Gemini, NanoBanana), the service should read its API key from the corresponding environment variable (GEMINI_API_KEY, NANOBANANA_API_KEY), and throw a configuration error if the variable is missing.

**Validates: Requirements 14.1, 14.4, 15.1, 15.4, 19.1, 19.2, 19.3**

### Property 25: Service Request Parameter Inclusion

For any Gemini service request, the request should include topic and style parameters, and for any NanoBanana service request, the request should include the visual description parameter.

**Validates: Requirements 14.2, 15.2**

### Property 26: Response Parsing Correctness

For any Gemini API response, the service should parse the response into a MemeConcept structure with caption, punchline, and visualDescription fields.

**Validates: Requirements 14.3**

### Property 27: Retry with Exponential Backoff

For any transient service failure (network error, timeout, 5xx error), the system should retry the operation up to 3 times with exponentially increasing delays (1s, 2s, 4s) before reporting failure.

**Validates: Requirements 14.5, 15.5**

### Property 28: Service Timeout Enforcement

For any service call, the operation should be terminated if it exceeds its timeout threshold: 10 seconds for Gemini, 30 seconds for NanoBanana, 45 seconds for FFmpeg, and 60 seconds for the complete pipeline.

**Validates: Requirements 6.7, 7.6, 8.8, 14.6, 15.6, 22.1**

### Property 29: FFmpeg Installation Verification

For any video generation request, the FFmpeg service should verify that FFmpeg is installed and accessible before attempting video generation, and throw a configuration error if not available.

**Validates: Requirements 16.1, 16.7**

### Property 30: FFmpeg Input Parameters

For any FFmpeg service call, the service should accept imageUrl, caption, and punchline as input parameters.

**Validates: Requirements 16.2**

### Property 31: Temporary File Cleanup

For any video generation operation, all temporary files (downloaded images, intermediate video files) should be deleted after the operation completes, whether successful or failed.

**Validates: Requirements 16.8**

### Property 32: Environment Variable Validation at Startup

For any application startup, the system should validate that all required environment variables (GEMINI_API_KEY, NANOBANANA_API_KEY, MONGODB_URI) are present and non-empty.

**Validates: Requirements 19.4**

### Property 33: API Key Security

For any error message, log entry, or API response, the content should not contain API keys or other sensitive credentials.

**Validates: Requirements 19.5**

### Property 34: Database Persistence

For any successful meme generation, a document should be stored in MongoDB containing userId, timestamp, topic, style, mode, and output URLs.

**Validates: Requirements 20.1, 20.2**

### Property 35: History Retrieval

For any history request with a userId, the system should return only memes created by that user, ordered by timestamp descending.

**Validates: Requirements 20.4**

### Property 36: History Pagination

For any history request, the results should be paginated with 20 items per page, and the response should include pagination metadata (page, limit, total, hasMore).

**Validates: Requirements 20.5**

### Property 37: Responsive UI Rendering

For any viewport size (mobile: <640px, tablet: 640-1024px, desktop: >1024px), the UI should render without horizontal scrolling and all interactive elements should remain accessible.

**Validates: Requirements 21.6**

### Property 38: Trending Topics Cache

For any trending topics request, if a cached result exists and is less than 5 minutes old, the cached result should be returned without making a new API call.

**Validates: Requirements 22.2**

### Property 39: Lazy Loading for History Images

For any meme history display, images should only be loaded when they enter or are about to enter the viewport, not all at once on page load.

**Validates: Requirements 22.3**

### Property 40: Image Compression

For any generated meme image stored in the system, the image should be compressed to reduce file size while maintaining visual quality.

**Validates: Requirements 22.4**

### Property 41: Accessibility - Alt Text

For any displayed meme image, the image element should have an alt attribute containing descriptive text.

**Validates: Requirements 23.1**

### Property 42: Accessibility - Keyboard Navigation

For any interactive element (buttons, inputs, toggles, selectors), the element should be focusable and activatable using only keyboard input (Tab, Enter, Space).

**Validates: Requirements 23.2**

### Property 43: Accessibility - Color Contrast

For any text element in the UI, the color contrast ratio between the text and its background should be at least 4.5:1.

**Validates: Requirements 23.3**

### Property 44: Accessibility - ARIA Labels

For any form control (input, select, toggle), the element should have an associated ARIA label or aria-labelledby attribute.

**Validates: Requirements 23.4**

### Property 45: Accessibility - Loading Announcements

For any loading state change, the change should be announced to screen readers via an ARIA live region.

**Validates: Requirements 23.5**

### Property 46: Accessibility - Focus Indicators

For any interactive element, when focused via keyboard navigation, a visible focus indicator (outline, border, or background change) should be displayed.

**Validates: Requirements 23.6**


## Testing Strategy

The MEME-AGENT testing strategy employs a dual approach combining unit tests for specific examples and edge cases with property-based tests for universal correctness guarantees.

### Testing Framework Selection

**Unit Testing**: Jest with React Testing Library
- Industry standard for Next.js applications
- Excellent React component testing support
- Built-in mocking capabilities
- Fast execution for rapid feedback

**Property-Based Testing**: fast-check
- Mature TypeScript property-based testing library
- Integrates seamlessly with Jest
- Supports complex data generation
- Configurable iteration counts

### Test Organization

```
/app/meme-agent/
├── __tests__/
│   ├── unit/
│   │   ├── components/
│   │   │   ├── ModeSelector.test.tsx
│   │   │   ├── TrendingTopics.test.tsx
│   │   │   ├── CustomTopicInput.test.tsx
│   │   │   ├── StyleSelector.test.tsx
│   │   │   ├── VideoToggle.test.tsx
│   │   │   ├── MemePreview.test.tsx
│   │   │   ├── LoadingIndicator.test.tsx
│   │   │   └── ErrorMessage.test.tsx
│   │   ├── services/
│   │   │   ├── memeConceptGenerator.test.ts
│   │   │   ├── memeImageGenerator.test.ts
│   │   │   ├── memeVideoGenerator.test.ts
│   │   │   └── trendingTopicsService.test.ts
│   │   └── api/
│   │       ├── generate.test.ts
│   │       └── history.test.ts
│   └── properties/
│       ├── validation.properties.test.ts
│       ├── generation.properties.test.ts
│       ├── output.properties.test.ts
│       ├── ui.properties.test.ts
│       └── accessibility.properties.test.ts
```

### Unit Testing Strategy

Unit tests focus on:
- Specific examples that demonstrate correct behavior
- Edge cases (empty inputs, boundary values, null/undefined)
- Error conditions (service failures, timeouts, invalid data)
- Integration points between components
- UI interactions (clicks, input changes, form submissions)

**Example Unit Test**:
```typescript
// components/CustomTopicInput.test.tsx
describe('CustomTopicInput', () => {
  it('should display error for topic shorter than 3 characters', () => {
    const { getByRole, getByText } = render(
      <CustomTopicInput value="ab" onChange={jest.fn()} error={null} />
    );
    
    const input = getByRole('textbox');
    fireEvent.blur(input);
    
    expect(getByText('Topic must be at least 3 characters long')).toBeInTheDocument();
  });

  it('should accept topic with exactly 3 characters', () => {
    const onChange = jest.fn();
    const { getByRole, queryByText } = render(
      <CustomTopicInput value="abc" onChange={onChange} error={null} />
    );
    
    const input = getByRole('textbox');
    fireEvent.blur(input);
    
    expect(queryByText(/must be at least/i)).not.toBeInTheDocument();
  });

  it('should display error for topic longer than 200 characters', () => {
    const longTopic = 'a'.repeat(201);
    const { getByRole, getByText } = render(
      <CustomTopicInput value={longTopic} onChange={jest.fn()} error={null} />
    );
    
    const input = getByRole('textbox');
    fireEvent.blur(input);
    
    expect(getByText('Topic must be no more than 200 characters')).toBeInTheDocument();
  });
});
```

### Property-Based Testing Strategy

Property tests verify universal properties across many generated inputs. Each property test runs a minimum of 100 iterations with randomized inputs.

**Configuration**:
```typescript
// jest.config.js
module.exports = {
  testMatch: ['**/*.properties.test.ts'],
  testTimeout: 30000, // Longer timeout for property tests
};
```

**Property Test Structure**:
```typescript
import fc from 'fast-check';

describe('Property Tests: Custom Topic Validation', () => {
  /**
   * Feature: meme-agent, Property 5: Custom Topic Validation
   * 
   * For any custom topic input, the input should be accepted if and only if
   * its length is between 3 and 200 characters inclusive, and rejected with
   * an error message otherwise.
   */
  it('should validate topic length correctly for all inputs', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 300 }),
        (topic) => {
          const result = validateCustomTopic(topic);
          const isValidLength = topic.length >= 3 && topic.length <= 200;
          
          if (isValidLength) {
            expect(result.valid).toBe(true);
            expect(result.error).toBeNull();
          } else {
            expect(result.valid).toBe(false);
            expect(result.error).toBeTruthy();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: meme-agent, Property 6: Input Sanitization
   * 
   * For any custom topic input containing potentially malicious patterns,
   * the sanitized output should not contain executable code or special
   * characters that could cause injection attacks.
   */
  it('should sanitize malicious input patterns', () => {
    const maliciousPatterns = [
      '<script>alert("xss")</script>',
      '"; DROP TABLE users; --',
      '${7*7}',
      '{{7*7}}',
      '<img src=x onerror=alert(1)>',
      'javascript:alert(1)',
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...maliciousPatterns),
        fc.string({ minLength: 3, maxLength: 50 }),
        (malicious, normal) => {
          const topic = normal + malicious;
          const sanitized = sanitizeCustomTopic(topic);
          
          // Should not contain script tags
          expect(sanitized).not.toMatch(/<script/i);
          // Should not contain SQL injection patterns
          expect(sanitized).not.toMatch(/DROP TABLE/i);
          // Should not contain template injection
          expect(sanitized).not.toMatch(/\$\{|\{\{/);
          // Should not contain event handlers
          expect(sanitized).not.toMatch(/onerror=/i);
          // Should not contain javascript: protocol
          expect(sanitized).not.toMatch(/javascript:/i);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Example Property Tests by Category**:

#### Validation Properties
```typescript
// validation.properties.test.ts

/**
 * Feature: meme-agent, Property 3: Trending Topics Range
 */
it('should return 3-10 trending topics for any successful fetch', () => {
  fc.assert(
    fc.property(
      fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 3, maxLength: 10 }),
      async (mockTopics) => {
        // Mock the trend agent to return mockTopics
        const topics = await getTrendingTopics();
        expect(topics.length).toBeGreaterThanOrEqual(3);
        expect(topics.length).toBeLessThanOrEqual(10);
      }
    ),
    { numRuns: 100 }
  );
});
```

#### Generation Properties
```typescript
// generation.properties.test.ts

/**
 * Feature: meme-agent, Property 9: Concept Structure Constraints
 */
it('should generate concepts with valid length constraints', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 3, maxLength: 200 }),
      fc.constantFrom('classic', 'modern', 'minimalist'),
      async (topic, style) => {
        const concept = await generateMemeConcept(topic, style);
        
        expect(concept.caption.length).toBeLessThanOrEqual(100);
        expect(concept.punchline.length).toBeLessThanOrEqual(100);
        expect(concept.visualDescription.length).toBeGreaterThan(0);
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Feature: meme-agent, Property 28: Service Timeout Enforcement
 */
it('should timeout services that exceed their threshold', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 11000, max: 20000 }), // Delays longer than 10s timeout
      async (delay) => {
        const mockSlowService = () => new Promise(resolve => 
          setTimeout(resolve, delay)
        );
        
        await expect(
          generateWithTimeout(mockSlowService, 10000)
        ).rejects.toThrow(/timeout/i);
      }
    ),
    { numRuns: 100 }
  );
});
```

#### Output Properties
```typescript
// output.properties.test.ts

/**
 * Feature: meme-agent, Property 8: Conditional Video Output
 */
it('should include video in output only when toggle is enabled', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 3, maxLength: 200 }),
      fc.constantFrom('classic', 'modern', 'minimalist'),
      fc.boolean(),
      async (topic, style, videoEnabled) => {
        const output = await generateMeme({
          topic,
          style,
          generateVideo: videoEnabled,
          mode: 'custom',
          userId: 'test-user',
        });
        
        expect(output.memeImage).toBeTruthy();
        expect(output.memeCaption).toBeTruthy();
        
        if (videoEnabled) {
          expect(output.memeVideo).toBeTruthy();
        } else {
          expect(output.memeVideo).toBeUndefined();
        }
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Feature: meme-agent, Property 10: HTTPS URL Validation
 */
it('should return only HTTPS URLs that are accessible', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 3, maxLength: 200 }),
      fc.constantFrom('classic', 'modern', 'minimalist'),
      fc.boolean(),
      async (topic, style, videoEnabled) => {
        const output = await generateMeme({
          topic,
          style,
          generateVideo: videoEnabled,
          mode: 'custom',
          userId: 'test-user',
        });
        
        // Check image URL
        expect(output.memeImage).toMatch(/^https:\/\//);
        const imageResponse = await fetch(output.memeImage, { method: 'HEAD' });
        expect(imageResponse.status).toBe(200);
        
        // Check video URL if present
        if (output.memeVideo) {
          expect(output.memeVideo).toMatch(/^https:\/\//);
          const videoResponse = await fetch(output.memeVideo, { method: 'HEAD' });
          expect(videoResponse.status).toBe(200);
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

#### UI Properties
```typescript
// ui.properties.test.ts

/**
 * Feature: meme-agent, Property 20: Control Disabling During Generation
 */
it('should disable all controls during generation', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('concept', 'image', 'video'),
      (stage) => {
        const { getByRole } = render(
          <MemeAgentPage initialGenerationStage={stage} />
        );
        
        const generateButton = getByRole('button', { name: /generate/i });
        const modeSelector = getByRole('radiogroup');
        const styleSelector = getByRole('radiogroup', { name: /style/i });
        const videoToggle = getByRole('switch');
        
        expect(generateButton).toBeDisabled();
        expect(modeSelector).toHaveAttribute('aria-disabled', 'true');
        expect(styleSelector).toHaveAttribute('aria-disabled', 'true');
        expect(videoToggle).toBeDisabled();
      }
    ),
    { numRuns: 100 }
  );
});
```

#### Accessibility Properties
```typescript
// accessibility.properties.test.ts

/**
 * Feature: meme-agent, Property 42: Accessibility - Keyboard Navigation
 */
it('should make all interactive elements keyboard accessible', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(
        'button[role="button"]',
        'input[type="text"]',
        'input[type="radio"]',
        'button[role="switch"]'
      ),
      (selector) => {
        const { container } = render(<MemeAgentPage />);
        const elements = container.querySelectorAll(selector);
        
        elements.forEach(element => {
          // Should be focusable
          expect(element).toHaveAttribute('tabindex');
          const tabIndex = element.getAttribute('tabindex');
          expect(parseInt(tabIndex!)).toBeGreaterThanOrEqual(0);
          
          // Should respond to keyboard events
          fireEvent.focus(element);
          expect(document.activeElement).toBe(element);
        });
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Feature: meme-agent, Property 43: Accessibility - Color Contrast
 */
it('should maintain 4.5:1 contrast ratio for all text', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(
        '.text-foreground',
        '.text-muted-foreground',
        'button',
        'label'
      ),
      (selector) => {
        const { container } = render(<MemeAgentPage />);
        const elements = container.querySelectorAll(selector);
        
        elements.forEach(element => {
          const styles = window.getComputedStyle(element);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          const contrastRatio = calculateContrastRatio(color, backgroundColor);
          expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
        });
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage
  - Components: 90%+ (high UI interaction)
  - Services: 85%+ (business logic)
  - API Routes: 80%+ (integration points)

- **Property Test Coverage**: All 46 correctness properties
  - Each property implemented as at least one property-based test
  - Minimum 100 iterations per property test
  - Focus on universal behaviors and constraints

### Mocking Strategy

**External Services**:
- Mock Gemini API responses with realistic data
- Mock NanoBanana API responses with test image URLs
- Mock FFmpeg execution with pre-generated test videos
- Mock MongoDB operations with in-memory database

**Example Mocks**:
```typescript
// __mocks__/gemini.ts
export const mockGeminiClient = {
  generateWithRetry: jest.fn().mockResolvedValue(
    JSON.stringify({
      caption: 'Test caption',
      punchline: 'Test punchline',
      visualDescription: 'A test image description',
    })
  ),
};

// __mocks__/nanobanana.ts
export const mockNanoBananaClient = {
  generateWithRetry: jest.fn().mockResolvedValue(
    'https://example.com/test-image.jpg'
  ),
};

// __mocks__/ffmpeg.ts
export const mockFFmpegService = {
  verifyInstallation: jest.fn().mockResolvedValue(true),
  createMemeVideo: jest.fn().mockResolvedValue(
    'https://example.com/test-video.mp4'
  ),
};
```

### Integration Testing

Integration tests verify the complete generation pipeline:

```typescript
describe('Integration: Complete Meme Generation', () => {
  it('should generate meme with image only', async () => {
    const request = {
      mode: 'custom' as const,
      topic: 'Test topic',
      style: 'classic' as const,
      generateVideo: false,
      userId: 'test-user',
    };

    const response = await POST('/api/generate', { body: request });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.output.memeImage).toMatch(/^https:\/\//);
    expect(data.output.memeCaption).toBeTruthy();
    expect(data.output.memeVideo).toBeUndefined();
  });

  it('should generate meme with image and video', async () => {
    const request = {
      mode: 'custom' as const,
      topic: 'Test topic',
      style: 'modern' as const,
      generateVideo: true,
      userId: 'test-user',
    };

    const response = await POST('/api/generate', { body: request });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.output.memeImage).toMatch(/^https:\/\//);
    expect(data.output.memeCaption).toBeTruthy();
    expect(data.output.memeVideo).toMatch(/^https:\/\//);
  });
});
```

### Performance Testing

Performance tests verify timeout and caching requirements:

```typescript
describe('Performance Tests', () => {
  it('should complete generation within 60 seconds', async () => {
    const startTime = Date.now();
    
    await generateMeme({
      mode: 'custom',
      topic: 'Performance test',
      style: 'classic',
      generateVideo: true,
      userId: 'test-user',
    });
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(60000);
  });

  it('should use cached trending topics within 5 minutes', async () => {
    // First call - should fetch from API
    const firstCall = await getTrendingTopics();
    const firstCallTime = Date.now();
    
    // Second call within 5 minutes - should use cache
    const secondCall = await getTrendingTopics();
    const secondCallTime = Date.now();
    
    expect(secondCallTime - firstCallTime).toBeLessThan(100); // Cache hit is fast
    expect(firstCall).toEqual(secondCall);
  });
});
```

### Continuous Integration

Tests run automatically on:
- Every commit (unit tests only for speed)
- Every pull request (full test suite including property tests)
- Nightly builds (full test suite + performance tests)

**CI Configuration** (.github/workflows/test.yml):
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:properties
      - run: npm run test:integration
```

### Test Execution Commands

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:properties": "jest --testPathPattern=properties",
    "test:integration": "jest --testPathPattern=integration",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

## Summary

This design document provides a comprehensive blueprint for implementing the MEME-AGENT feature. The architecture follows Next.js best practices with clear separation between presentation, API, service, and integration layers. The component structure is modular and reusable, with well-defined interfaces and type safety throughout.

The design emphasizes:
- **Modularity**: Clear separation of concerns with isolated components and services
- **Type Safety**: Comprehensive TypeScript types for all data structures
- **Error Handling**: Robust error handling with retry logic and user-friendly messages
- **Performance**: Timeout enforcement, caching, and lazy loading optimizations
- **Accessibility**: WCAG 2.1 Level AA compliance with keyboard navigation and screen reader support
- **Testability**: Dual testing approach with unit tests and property-based tests for comprehensive coverage

The 46 correctness properties provide formal specifications that bridge requirements and implementation, ensuring the system behaves correctly across all valid inputs and scenarios.

