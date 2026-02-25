# Zenyth - AI-Powered Content Creation Platform

<div align="center">
  <img src="/public/screenshot/image1.png" alt="Zenyth Dashboard" width="800"/>
  
  **Generate videos, thumbnails, scripts & memes. Post everywhere in one click. Ride every trend.**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
</div>

---

## 🚀 Overview

Zenyth is an all-in-one AI-powered content creation platform designed for modern creators. It combines multiple AI agents to help you generate, optimize, and publish content across all major social media platforms. From memes to music, thumbnails to full content calendars, Zenyth streamlines your entire content workflow.

### Why Zenyth?

- **10x Faster Content Creation**: Generate a month of content in minutes
- **Multi-Platform Publishing**: Post to YouTube, Instagram, X, LinkedIn simultaneously
- **AI-Powered Intelligence**: Leverage Google Gemini 3.0 for cutting-edge content generation
- **Trend Detection**: Stay ahead with real-time trend analysis
- **Competitor Intelligence**: Analyze competitors and identify content gaps
- **Zero Design Skills Required**: Professional-quality content without design expertise

---

## ✨ Features

### 1. 🎨 Meme Agent

Generate viral-ready memes with AI-powered concept generation and image creation.

**Capabilities:**
- **Trending Topics**: Auto-detect trending topics from social media
- **Custom Topics**: Generate memes on any topic you specify
- **Multiple Styles**: Choose from various meme styles (classic, modern, minimalist, bold, etc.)
- **Video Memes**: Create animated video memes with Veo 3.1
- **History Tracking**: Access all previously generated memes
- **Download Options**: Export as PNG or MP4

**Example Usage:**
```
1. Select "Trending" mode to see current viral topics
2. Click on a trending topic or enter your custom topic
3. Choose a meme style (e.g., "Bold & Colorful")
4. Toggle video mode if you want an animated meme
5. Click "Generate Meme" and get your viral-ready content in seconds
```

**Technical Details:**
- Uses Gemini 3.0 Flash for concept generation
- Gemini 3.0 Pro Image for static meme creation
- Veo 3.1 for video meme generation
- Automatic color contrast validation for accessibility
- Image compression for optimal file sizes

---

### 2. 🎬 Thumbnail Agent

Create eye-catching YouTube thumbnails with AI-generated faces and text overlays.

**Capabilities:**
- **Face Consistency**: Generate consistent character faces across thumbnails
- **Custom Text Overlays**: Add compelling text with customizable styling
- **Style Variations**: Multiple artistic styles (photorealistic, cinematic, vibrant, etc.)
- **A/B Testing Ready**: Generate multiple variants for testing
- **High Resolution**: Export in YouTube-optimized dimensions
- **History & Regeneration**: Save and regenerate previous thumbnails

**Example Usage:**
```
1. Enter your video topic: "How to Build a SaaS in 2024"
2. Add main text: "BUILD A SAAS"
3. Add subtitle: "Complete Guide"
4. Select style: "Cinematic & Professional"
5. Click "Generate Thumbnail"
6. Download and upload to YouTube
```

**Technical Details:**
- Gemini 3.0 Pro Image for thumbnail generation
- Automatic face consistency using seed-based generation
- Text overlay with customizable fonts, colors, and positioning
- Cloudinary integration for image storage and optimization

---

### 3. 🎵 Music Agent

Generate custom background music and soundtracks for your content.

**Capabilities:**
- **AI Music Generation**: Create original music from text descriptions
- **Multiple Genres**: Support for all music genres and moods
- **Instrumental Control**: Specify instruments and musical elements
- **Duration Control**: Generate music of specific lengths
- **Audio Player**: Preview before downloading
- **History Management**: Access all generated tracks

**Example Usage:**
```
1. Enter prompt: "Upbeat electronic music with synth and drums, energetic and motivational"
2. Specify duration: "30 seconds"
3. Click "Generate Music"
4. Preview the generated track
5. Download as MP3 for your video
```

**Technical Details:**
- Suno AI integration for music generation
- Intelligent prompt parsing for optimal results
- MP3 format output
- MongoDB storage for history tracking

---

### 4. 📅 Content Planner

Generate comprehensive content calendars with AI-powered strategy.

**Capabilities:**
- **Multi-Day Planning**: Create 7-day, 14-day, or 30-day content plans
- **Platform-Specific**: Tailored content for YouTube, Instagram, X, LinkedIn
- **Niche Targeting**: Customized for your specific niche
- **Content Variety**: Mix of content types (tutorials, shorts, posts, etc.)
- **Engagement Optimization**: AI-suggested posting times and strategies
- **Export Options**: Download as JSON or CSV
- **Visual Calendar**: Interactive calendar view with stats

**Example Usage:**
```
1. Select platform: "YouTube"
2. Enter niche: "Tech Reviews"
3. Choose duration: "30 days"
4. Click "Generate Plan"
5. Review the AI-generated content calendar
6. Export to CSV for your team
```

**Technical Details:**
- Gemini 3.0 Flash for content strategy generation
- Structured JSON output with validation
- Statistical analysis (content type distribution, posting frequency)
- Export functionality for team collaboration

---

### 5. 📱 All-In-One Post

Publish content across all social media platforms simultaneously.

**Capabilities:**
- **Multi-Platform Publishing**: Post to YouTube, Instagram, X, LinkedIn at once
- **Platform Connections**: Secure OAuth integration via Composio
- **Media Upload**: Support for images and videos
- **Platform-Specific Optimization**: Auto-adjust content for each platform
- **Connection Management**: Easy connect/disconnect for each platform
- **Publishing Progress**: Real-time status updates during publishing

**Example Usage:**
```
1. Connect your social media accounts (one-time setup)
2. Enter your post content: "Just launched our new AI feature! 🚀"
3. Upload media (image or video)
4. Select platforms: YouTube, Instagram, X, LinkedIn
5. Click "Publish to All Platforms"
6. Watch as your content goes live everywhere simultaneously
```

**Technical Details:**
- Composio integration for social media APIs
- Cloudinary for media hosting and delivery
- Platform-specific media upload handling:
  - Twitter: 3-step upload (MD5 hash → presigned URL → PUT file)
  - Instagram: Public URL requirement (Cloudinary URLs)
  - LinkedIn: 3-step upload process
- Real-time publishing status with animated progress

---

### 6. 🔍 Competitor Intelligence

Analyze competitor channels to uncover their content strategy and identify opportunities.

**Capabilities:**
- **YouTube Analysis**: Scrape and analyze any YouTube channel
- **Instagram Analysis**: Analyze Instagram profiles and content
- **Performance Metrics**: Views, engagement rates, subscriber growth
- **Posting Patterns**: Identify optimal posting times and frequency
- **Audience Insights**: Understand target audience and content style
- **Content Gaps**: Discover underserved topics and opportunities
- **Strategic Recommendations**: AI-generated actionable insights
- **Analysis History**: Track multiple competitor analyses

**Example Usage:**
```
1. Enter competitor URL: "https://youtube.com/@competitor"
2. Click "Analyze"
3. Wait 1-2 minutes for comprehensive analysis
4. Review 4 analysis categories:
   - Content Performance (top videos, engagement rates)
   - Posting Patterns (frequency, best times)
   - Audience Insights (target audience, content style)
   - Content Gaps (opportunities, underserved topics)
5. Implement strategic recommendations
```

**Technical Details:**
- Apify integration for web scraping:
  - YouTube: `streamers~youtube-channel-scraper`
  - Instagram: `apify~instagram-profile-scraper`
- Gemini 3.0 Flash for AI analysis
- 4-category analysis framework
- Historical tracking in MongoDB

---

### 7. 📊 Dashboard

Centralized hub for all your content creation activities.

**Capabilities:**
- **Real-Time Stats**: Track total content generated across all agents
- **Activity Feed**: Recent generations and analyses
- **Quick Actions**: Fast access to all agents
- **Trending Topics**: See what's viral right now
- **User Profile**: Clerk authentication with user management
- **Responsive Design**: Works on desktop, tablet, and mobile

**Dashboard Metrics:**
- Total content pieces generated
- Memes created
- Thumbnails generated
- Music tracks produced
- Content plans created
- Competitor analyses performed

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.6**: React framework with App Router
- **React 19.2.3**: UI library
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **tw-animate-css**: Animation utilities

### Backend & APIs
- **Google Gemini 3.0**: AI content generation
  - `gemini-3-flash-preview`: Text generation
  - `gemini-3-pro-image-preview`: Image generation
  - `veo-3.1-generate-preview`: Video generation
- **Composio**: Social media API integration
- **Suno AI**: Music generation
- **Apify**: Web scraping for competitor analysis
- **Cloudinary**: Media storage and CDN

### Database & Auth
- **MongoDB**: Data persistence
- **Clerk**: Authentication and user management

### Testing
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **fast-check**: Property-based testing

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- MongoDB database
- API keys for required services

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/zenyth.git
cd zenyth
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Google AI (Gemini)
GOOGLE_GENAI_API_KEY=your_google_genai_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Composio (Social Media Integration)
COMPOSIO_API_KEY=your_composio_api_key

# Suno AI (Music Generation)
SUNO_API_KEY=your_suno_api_key

# Apify (Competitor Analysis)
APIFY_API_TOKEN=your_apify_token
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 API Keys Setup

### Clerk (Authentication)
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable and secret keys

### Google Gemini AI
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Enable Gemini 3.0 models

### Cloudinary (Media Storage)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and secret from dashboard

### Composio (Social Media)
1. Sign up at [composio.dev](https://composio.dev)
2. Create an API key
3. Enable required integrations (YouTube, Instagram, X, LinkedIn)

### Suno AI (Music)
1. Sign up at [suno.ai](https://suno.ai)
2. Subscribe to API access
3. Generate API key

### Apify (Web Scraping)
1. Sign up at [apify.com](https://apify.com)
2. Create API token
3. Subscribe to required actors:
   - `streamers~youtube-channel-scraper`
   - `apify~instagram-profile-scraper`

### MongoDB
1. Create a free cluster at [mongodb.com](https://mongodb.com)
2. Get connection string
3. Database name: `zenythh`

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Add all environment variables from `.env.local` to your Vercel project settings.

### Build Command
```bash
npm run build
```

---

## 📁 Project Structure

```
zenyth/
├── app/
│   ├── all-in-one-post/       # Multi-platform publishing
│   ├── competitor-intel/      # Competitor analysis
│   ├── dashboard/             # Main dashboard
│   ├── meme-agent/            # Meme generator
│   ├── music-agent/           # Music generator
│   ├── planner/               # Content planner
│   ├── thumbnail-agent/       # Thumbnail generator
│   ├── settings/              # User settings
│   └── api/                   # API routes
├── components/
│   ├── dashboard/             # Dashboard components
│   └── landing/               # Landing page components
├── lib/
│   ├── mongodb.ts             # Database connection
│   ├── cloudinary.ts          # Media upload
│   ├── apify.ts               # Web scraping
│   └── composio.ts            # Social media APIs
├── public/
│   └── screenshot/            # App screenshots
└── README.md
```

---

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

---

## 🎨 Design System

### Colors
- **Primary**: `oklch(0.6 0.2 45)` - Orange accent
- **Text Primary**: `#37322F` - Dark brown
- **Text Secondary**: `#605A57` - Medium brown
- **Text Tertiary**: `#847971` - Light brown
- **Background**: `#FFFFFF` - White
- **Background Secondary**: `#FBFAF9` - Off-white
- **Border**: `rgba(55,50,47,0.12)` - Subtle border

### Typography
- **Headings**: Serif font family
- **Body**: Sans-serif font family
- **Buttons**: Rounded-full with shadow effects
- **Cards**: Rounded-xl with subtle borders

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini**: For powerful AI models
- **Composio**: For seamless social media integration
- **Suno AI**: For music generation capabilities
- **Apify**: For web scraping infrastructure
- **Cloudinary**: For media management
- **Clerk**: For authentication
- **Vercel**: For hosting and deployment

---

## 📞 Support

For support, email support@zenyth.ai or join our Discord community.

---

## 🗺️ Roadmap

- [ ] TikTok integration
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Content scheduling
- [ ] AI voice generation
- [ ] Automated A/B testing
- [ ] Mobile app (iOS & Android)
- [ ] Browser extension

---

<div align="center">
  Made with ❤️ by the Zenyth Team
  
  [Website](https://zenyth.ai) • [Documentation](https://docs.zenyth.ai) • [Discord](https://discord.gg/zenyth)
</div>
