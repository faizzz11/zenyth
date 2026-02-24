# 🖼️ Thumbnail Agent

AI-powered YouTube thumbnail generator using Google's Gemini Nano Banana Pro (gemini-3-pro-image-preview).

## Overview

The Thumbnail Agent generates high-converting YouTube-style thumbnails with the user's face, creating 4 distinct variations optimized for different content styles.

## Features

### Core Functionality

- **Face-First Design**: User's face photo is mandatory and featured prominently
- **4 Unique Variations**: Each generation creates 4 distinct thumbnail styles
- **Style Learning**: Uses 10 reference thumbnails to learn composition patterns
- **YouTube Optimization**: 1280x720 resolution, mobile-first design
- **Ethical AI**: No face cloning, no copyright copying

### Input Options

**Required:**
- User face photo (clear frontal image)

**Optional:**
- Additional images (logos, objects, backgrounds)
- Video type (vlog, challenge, tech review, reaction, finance, fitness, gaming, educational, entertainment)
- Detailed design instructions (colors, emotions, text placement)

### 4 Thumbnail Styles

1. **Dramatic Shock**
   - High emotion, shocked/surprised expression
   - Red and yellow color contrast
   - Dark dramatic background with spotlight
   - Viral appeal, attention-grabbing

2. **Clean Professional**
   - Balanced composition, soft lighting
   - Blue and white color scheme
   - Confident expression
   - Trustworthy, educational vibe

3. **Cinematic Dark**
   - Dark moody background
   - Spotlight on face
   - Purple and orange color grading
   - Film noir style, mysterious

4. **Bright Viral**
   - High saturation, vibrant colors
   - Energetic happy expression
   - Sharp outlines, dynamic composition
   - Fun, attention-grabbing

## Technical Implementation

### Architecture

```
app/thumbnail-agent/
├── api/
│   ├── generate/
│   │   └── route.ts          # Thumbnail generation endpoint
│   └── history/
│       └── route.ts           # History retrieval
├── components/
│   ├── ImageUploader.tsx      # Drag-and-drop image upload
│   ├── ThumbnailForm.tsx      # Input form
│   ├── ThumbnailGrid.tsx      # Results display
│   └── LoadingIndicator.tsx   # Generation progress
├── services/
│   ├── thumbnailGenerator.ts  # Gemini integration
│   └── faceDetection.ts       # Image validation
├── types.ts                   # TypeScript interfaces
├── page.tsx                   # Main page
└── README.md                  # This file
```

### API Integration

**Model**: `gemini-3-pro-image-preview` (Nano Banana Pro)
**Resolution**: 1280x720 pixels (16:9 aspect ratio)
**Generation Time**: ~30-60 seconds for 4 variations
**Storage**: MongoDB for history, local filesystem for images

### Reference Learning System

The system uses 10 reference thumbnails from `/public/thumbnail-ref/` to learn:
- Composition patterns
- Color contrast techniques
- Text placement strategies
- Facial expression intensity
- Layout best practices

**What it DOES NOT copy:**
- Exact layouts
- Specific text
- Identifiable faces
- Branded elements

## API Endpoints

### POST `/thumbnail-agent/api/generate`

Generate 4 thumbnail variations.

**Request Body:**
```json
{
  "faceImage": "data:image/jpeg;base64,...",
  "additionalImages": ["data:image/png;base64,..."],
  "videoType": "tech-review",
  "detailedInstructions": "Make it dramatic, red background, shocked expression",
  "userId": "user-id"
}
```

**Response:**
```json
{
  "success": true,
  "thumbnails": [
    {
      "imageUrl": "/thumbnails/thumbnail_dramatic-shock_1234567890.png",
      "style": "Dramatic Shock",
      "dominantColor": "Red",
      "emotion": "Shocked"
    },
    {
      "imageUrl": "/thumbnails/thumbnail_clean-professional_1234567890.png",
      "style": "Clean Professional",
      "dominantColor": "Blue",
      "emotion": "Confident"
    },
    {
      "imageUrl": "/thumbnails/thumbnail_cinematic-dark_1234567890.png",
      "style": "Cinematic Dark",
      "dominantColor": "Purple",
      "emotion": "Intense"
    },
    {
      "imageUrl": "/thumbnails/thumbnail_bright-viral_1234567890.png",
      "style": "Bright Viral",
      "dominantColor": "Yellow",
      "emotion": "Excited"
    }
  ]
}
```

### GET `/thumbnail-agent/api/history`

Retrieve user's thumbnail generation history.

**Query Parameters:**
- `userId`: User identifier

## Usage Flow

1. **Upload Face Photo**
   - Clear frontal photo
   - Good lighting
   - Neutral or expressive face

2. **Optional Customization**
   - Select video type for style hints
   - Add design instructions
   - Upload additional images (logos, objects)

3. **Generate**
   - Click "Generate 4 Thumbnail Variations"
   - Wait 30-60 seconds

4. **Review & Select**
   - Hover over each thumbnail to see details
   - Click to select favorite
   - Download in full resolution

5. **Regenerate (Optional)**
   - Create new variations with different inputs

## Ethical Guidelines

### Face Policy (Critical)

✅ **What We Do:**
- Use ONLY the user's uploaded face
- Preserve user's identity and features
- Enhance lighting and clarity

❌ **What We DON'T Do:**
- Insert other people's faces
- Clone celebrity faces
- Use faces from reference thumbnails
- Distort face beyond recognition

### Copyright & References

✅ **What We Learn:**
- Composition patterns
- Color contrast techniques
- Layout strategies
- Expression intensity

❌ **What We DON'T Copy:**
- Exact layouts
- Specific text
- Branded elements
- Identifiable designs

### Disclaimers

All thumbnails include clear attribution:
> "AI-generated thumbnail using your photo. Reference thumbnails used only for style learning, not copying."

## Thumbnail Optimization Rules

### YouTube Best Practices

1. **Resolution**: 1280x720 pixels (16:9)
2. **Face Size**: 30-50% of frame
3. **Contrast**: High contrast for mobile visibility
4. **Text Space**: Strategic areas for title overlays
5. **File Size**: Optimized for fast loading
6. **Mobile-First**: Readable on small screens

### Design Principles

- **Bold Colors**: High saturation for attention
- **Clear Face**: Well-lit, recognizable
- **Emotion**: Strong expression for engagement
- **Simplicity**: Avoid clutter
- **Contrast**: Text-ready backgrounds

## Edge Cases

### Low Quality Face Image
- System validates image quality
- Requests better photo if needed
- Provides specific feedback

### Vague Instructions
- Auto-generates based on video type
- Uses default style parameters
- Still creates 4 variations

### Missing Video Type
- Uses general-purpose styling
- Balances all 4 styles equally

## Future Enhancements

- [ ] Real-time face detection and validation
- [ ] Text overlay generation with custom titles
- [ ] A/B testing recommendations
- [ ] Click-through rate predictions
- [ ] Batch generation (multiple faces)
- [ ] Style mixing (combine elements)
- [ ] Video thumbnail extraction
- [ ] Animated thumbnail previews

## Dependencies

- `@google/genai`: ^0.8.0
- `mongodb`: ^6.21.0
- `next`: 16.1.6
- `react`: 19.2.3

## Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
```

## Development

```bash
# Start development server
npm run dev

# Navigate to
http://localhost:3000/thumbnail-agent
```

## File Structure

```
public/
├── thumbnail-ref/          # 10 reference thumbnails for learning
│   ├── image.png
│   ├── img1.jpg
│   ├── img2.jpg
│   └── ...
└── thumbnails/             # Generated thumbnails (auto-created)
    └── thumbnail_*.png
```

## Performance

- **Generation Time**: 30-60 seconds for 4 variations
- **Concurrent Requests**: Handled via queue
- **Image Size**: ~200-500KB per thumbnail
- **Storage**: Local filesystem + MongoDB metadata

## Security & Privacy

- Face images processed server-side only
- No face data stored permanently
- Images deleted after 30 days (configurable)
- No third-party face recognition APIs
- GDPR compliant

## Troubleshooting

### "Invalid face image" Error
- Ensure image is JPEG, PNG, or WebP
- Check file size (max 10MB)
- Use clear, frontal face photo

### Generation Takes Too Long
- Check API key validity
- Verify network connection
- Try with simpler instructions

### Thumbnails Look Similar
- Add more specific instructions
- Try different video types
- Upload additional reference images

## License

This implementation follows Google's Responsible AI principles and respects copyright laws. Generated thumbnails are for personal/commercial use by the uploader only.

## Credits

- **AI Model**: Google Gemini Nano Banana Pro
- **Design**: Inspired by YouTube thumbnail best practices
- **Architecture**: Built with Next.js and TypeScript
