# Quick Start Guide - Multi-Agent AI Platform

## Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Google Gemini API key

## Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/zenythh
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Access Agents

Open your browser:

- **Meme Agent**: http://localhost:3000/meme-agent
- **Music Agent**: http://localhost:3000/music-agent
- **Thumbnail Agent**: http://localhost:3000/thumbnail-agent

---

## Testing Each Agent

### 🎭 Meme Agent

1. Navigate to `/meme-agent`
2. Click "Refresh" to load trending topics
3. Select a topic or enter custom text
4. Choose style (classic/modern/minimalist)
5. Toggle video generation if desired
6. Click "Generate Meme"
7. Wait 30-60 seconds
8. Download your meme!

**Expected Result**: Image with text overlays (caption at top, punchline at bottom)

---

### 🎵 Music Agent

1. Navigate to `/music-agent`
2. Select mood (e.g., "Energetic")
3. Choose tempo (slow/medium/fast)
4. Pick genre (e.g., "Electronic")
5. Optionally add singer style
6. Click "Generate Music"

**Current Status**: UI complete, awaiting Lyria RealTime SDK support

---

### 🖼️ Thumbnail Agent

1. Navigate to `/thumbnail-agent`
2. Upload your face photo (clear frontal shot)
3. Optionally select video type
4. Optionally add design instructions
5. Click "Generate 4 Thumbnail Variations"
6. Wait 30-60 seconds
7. Review 4 different styles
8. Hover to see details
9. Click to select favorite
10. Download in 1280x720 resolution

**Expected Result**: 4 unique thumbnail variations with your face

---

## Troubleshooting

### "GEMINI_API_KEY not set"
- Check `.env.local` file exists
- Verify API key is correct
- Restart dev server

### "Failed to connect to MongoDB"
- Ensure MongoDB is running
- Check connection string in `.env.local`
- Verify database name is "zenythh"

### "Image generation failed"
- Check API key has image generation enabled
- Verify you're not on free tier (Nano Banana Pro requires paid)
- Check API quota/limits

### "Video generation timeout"
- Video can take 11s-6min (this is normal)
- Pipeline timeout is 8 minutes
- Check console for progress logs

---

## API Key Setup

### Get Gemini API Key

1. Go to https://aistudio.google.com/
2. Sign in with Google account
3. Click "Get API Key"
4. Create new API key
5. Copy and paste into `.env.local`

### Required Permissions

Your API key needs access to:
- ✅ Text generation (`gemini-2.0-flash-exp`)
- ✅ Image generation (`gemini-3-pro-image-preview`)
- ✅ Video generation (`veo-3.1-generate-preview`)
- ✅ Google Search tool
- ⏳ Lyria RealTime (coming soon)

---

## File Structure

```
zenythhh/
├── app/
│   ├── meme-agent/          # Meme generation
│   ├── music-agent/         # Music generation
│   ├── thumbnail-agent/     # Thumbnail generation
│   └── page.tsx             # Landing page
├── lib/
│   ├── gemini.ts            # Gemini client
│   ├── mongodb.ts           # Database connection
│   └── securityUtils.ts     # Security helpers
├── public/
│   ├── memes/               # Generated memes
│   ├── music/               # Generated music
│   ├── thumbnails/          # Generated thumbnails
│   └── thumbnail-ref/       # Reference thumbnails (10 images)
├── .env.local               # Environment variables
└── package.json             # Dependencies
```

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode

# Linting
npm run lint             # Check code quality
```

---

## Next Steps

1. ✅ Test Meme Agent
2. ✅ Test Thumbnail Agent
3. ⏳ Wait for Music Agent SDK support
4. 📚 Read individual agent READMEs
5. 🎨 Customize UI/styling
6. 🚀 Deploy to production

---

## Production Deployment

### Environment Variables

```env
GEMINI_API_KEY=your_production_api_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zenythh
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Build & Deploy

```bash
# Build
npm run build

# Start
npm start
```

### Recommended Platforms

- **Vercel**: Easiest Next.js deployment
- **Railway**: Good for MongoDB + Next.js
- **AWS/GCP**: Full control, scalable

---

## Support & Resources

### Documentation
- [Meme Agent README](app/meme-agent/README.md)
- [Music Agent README](app/music-agent/README.md)
- [Thumbnail Agent README](app/thumbnail-agent/README.md)
- [Agents Summary](AGENTS_SUMMARY.md)

### External Resources
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://www.mongodb.com/docs/)

---

## Tips for Best Results

### Meme Agent
- Use trending topics for viral potential
- Keep text short and punchy
- Modern style works best for social media

### Music Agent
- Be specific with mood and genre
- Combine multiple styles for unique sound
- Remember: instrumental only (no vocals)

### Thumbnail Agent
- Use clear, well-lit face photos
- Front-facing works best
- Try different video types for variety
- Add specific color/emotion instructions

---

## Performance Notes

- **Meme Generation**: 30-60 seconds
- **Music Generation**: 30 seconds (when SDK available)
- **Thumbnail Generation**: 30-60 seconds (4 variations)
- **Video Generation**: 11 seconds - 6 minutes

---

## Getting Help

1. Check agent-specific README
2. Review error messages in console
3. Verify environment variables
4. Check API key permissions
5. Review Gemini API status

---

Happy creating! 🎨🎵🖼️
