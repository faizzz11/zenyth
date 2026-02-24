# 🎵 Music Agent

AI-powered instrumental music generation using Google's Lyria RealTime API.

## Overview

The Music Agent generates AI instrumental music based on user-defined parameters including mood, tempo, genre, and optional style references.

## Features

- **Structured Input Parameters**
  - Mood: romantic, sad, energetic, aggressive, nostalgic, chill, upbeat
  - Tempo: slow, medium, fast (with optional BPM)
  - Genre: rap, pop, classical, bollywood, rock, lo-fi, jazz, electronic, folk
  - Singer Style: Optional stylistic reference (instrumental interpretation only)

- **Natural Language Prompts**
  - Optional free-text instructions for additional musical elements
  - Automatic parsing and parameter extraction

- **Ethical Constraints**
  - No voice cloning
  - Instrumental music only
  - Clear AI-generated disclaimers
  - Stylistic essence interpretation (not voice replication)

- **Audio Player**
  - Waveform visualization
  - Play/pause controls
  - Progress tracking
  - Download functionality

## Technical Stack

- **API**: Google Gemini Lyria RealTime (v1alpha)
- **Model**: `models/lyria-realtime-exp`
- **Output**: 16-bit PCM Audio, 44.1kHz, Stereo
- **Duration**: 30 seconds per generation
- **Storage**: MongoDB for history tracking

## Implementation Status

⚠️ **Note**: The Lyria RealTime Music API requires WebSocket support and real-time streaming capabilities that may not be fully available in the current `@google/genai` SDK version (v0.8.0).

### What's Implemented

✅ Complete UI/UX matching the Meme Agent design
✅ Form components with all parameter inputs
✅ Audio player with waveform visualization
✅ API routes for generation and history
✅ Prompt parsing and parameter conversion
✅ MongoDB integration for storage
✅ Error handling and validation
✅ Voice cloning prevention
✅ AI disclaimers

### What Needs SDK Support

⏳ WebSocket connection to Lyria RealTime
⏳ Real-time audio chunk streaming
⏳ PCM16 to WAV conversion
⏳ Session management (play/pause/stop)

## API Endpoints

### POST `/music-agent/api/generate`

Generate music based on parameters.

**Request Body:**
```json
{
  "mood": "energetic",
  "tempo": "fast",
  "bpm": 140,
  "genre": "electronic",
  "singerStyle": "Kumar Sanu",
  "freeTextPrompt": "Add tabla and sitar elements",
  "userId": "user-id"
}
```

**Response:**
```json
{
  "success": true,
  "output": {
    "audioUrl": "/music/music_1234567890.wav",
    "styleReference": "Kumar Sanu",
    "tempo": "fast",
    "mood": "energetic",
    "genre": "electronic",
    "duration": 30
  }
}
```

### GET `/music-agent/api/history`

Retrieve user's music generation history.

**Query Parameters:**
- `userId`: User identifier

## Usage

1. Navigate to `/music-agent`
2. Fill in the music parameters:
   - Select mood
   - Choose tempo (or specify BPM)
   - Pick genre
   - Optionally add singer style reference
   - Optionally add free-text instructions
3. Click "Generate Music"
4. Listen to the generated track
5. Download if desired

## Ethical Guidelines

### What the System Does
- Generates instrumental music in the stylistic essence of requested artists
- Interprets musical characteristics (tempo, instrumentation, mood)
- Creates original compositions inspired by styles

### What the System Does NOT Do
- Clone or replicate real singer voices
- Create official recordings of any artist
- Claim authenticity of any real artist
- Generate vocals or lyrics

### Disclaimers
All generated tracks include clear disclaimers:
> "This track is AI-generated instrumental music in the stylistic essence of the requested parameters. It is not an official recording or voice clone of any artist."

## Future Enhancements

- Multi-singer duet mode
- Lyric rewriting option
- Instrumental-only generation
- Background music generator
- Extended duration options (up to 60 seconds)
- Multiple output variations
- Style blending
- Real-time parameter adjustment

## File Structure

```
app/music-agent/
├── api/
│   ├── generate/
│   │   └── route.ts          # Music generation endpoint
│   └── history/
│       └── route.ts           # History retrieval endpoint
├── components/
│   ├── MusicForm.tsx          # Parameter input form
│   ├── AudioPlayer.tsx        # Audio playback component
│   └── LoadingIndicator.tsx   # Generation loading state
├── services/
│   ├── musicGenerator.ts      # Lyria RealTime integration
│   └── promptParser.ts        # NLP parameter extraction
├── types.ts                   # TypeScript interfaces
├── page.tsx                   # Main page component
└── README.md                  # This file
```

## Dependencies

- `@google/genai`: ^0.8.0 (requires v1alpha support for music)
- `mongodb`: ^6.21.0
- `next`: 16.1.6
- `react`: 19.2.3

## Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
```

## Development

To test the Music Agent locally:

```bash
npm run dev
```

Navigate to `http://localhost:3000/music-agent`

## Notes

- The Lyria RealTime API is in experimental preview
- Music generation requires v1alpha API access
- WebSocket support is required for streaming
- Generated audio is watermarked for identification
- Safety filters are applied to all prompts

## License

This implementation follows Google's Responsible AI principles and includes watermarking for AI-generated content identification.
