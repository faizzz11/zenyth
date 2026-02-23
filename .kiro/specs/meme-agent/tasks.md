# Implementation Plan: MEME-AGENT

## Overview

This implementation plan breaks down the MEME-AGENT feature into discrete, actionable coding tasks. The feature enables social media creators to generate trending meme images and short videos using AI-powered concept generation (Gemini), image synthesis (NanoBanana), and video processing (FFmpeg).

The implementation follows a modular architecture with:
- Feature code in `/app/meme-agent/`
- Shared integrations in `/lib/`
- TypeScript throughout
- MongoDB for persistence
- Next.js App Router patterns

## Tasks

- [x] 1. Set up shared integration libraries
  - [x] 1.1 Create Gemini API client in /lib/gemini.ts
    - Implement GeminiClient class with authentication
    - Add generateText method with timeout support
    - Add generateWithRetry method with exponential backoff (3 attempts)
    - Add createGeminiClient factory function
    - Validate GEMINI_API_KEY environment variable
    - _Requirements: 14.1, 14.2, 14.4, 14.5, 14.6, 19.1, 19.3_
  
  - [x]* 1.2 Write property tests for Gemini client
    - **Property 24: API Configuration from Environment**
    - **Property 27: Retry with Exponential Backoff**
    - **Property 28: Service Timeout Enforcement**
    - **Validates: Requirements 14.1, 14.4, 14.5, 14.6, 19.1, 19.3**
  
  - [x] 1.3 Create NanoBanana API client in /lib/nanobanana.ts
    - Implement NanoBananaClient class with authentication
    - Add generateImage method with timeout support
    - Add generateWithRetry method with exponential backoff (3 attempts)
    - Add createNanoBananaClient factory function
    - Validate NANOBANANA_API_KEY environment variable
    - _Requirements: 15.1, 15.2, 15.4, 15.5, 15.6, 19.2, 19.3_
  
  - [x]* 1.4 Write property tests for NanoBanana client
    - **Property 24: API Configuration from Environment**
    - **Property 27: Retry with Exponential Backoff**
    - **Property 28: Service Timeout Enforcement**
    - **Validates: Requirements 15.1, 15.4, 15.5, 15.6, 19.2, 19.3**
  
  - [x] 1.5 Create FFmpeg utilities in /lib/ffmpeg.ts
    - Implement FFmpegService class
    - Add verifyInstallation method
    - Add createMemeVideo method with image download, text overlays, and MP4 export
    - Implement temporary file cleanup
    - Add createFFmpegService factory function
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8_
  
  - [x]* 1.6 Write property tests for FFmpeg service
    - **Property 29: FFmpeg Installation Verification**
    - **Property 30: FFmpeg Input Parameters**
    - **Property 31: Temporary File Cleanup**
    - **Validates: Requirements 16.1, 16.2, 16.7, 16.8**
  
  - [x] 1.7 Create MongoDB client in /lib/mongodb.ts
    - Implement connectToDatabase function
    - Add closeDatabaseConnection function
    - Create indexes on memes collection (userId + createdAt, createdAt)
    - Validate MONGODB_URI environment variable
    - _Requirements: 20.1, 20.2, 20.3_

- [x] 2. Create type definitions and core structure
  - [x] 2.1 Create TypeScript types in /app/meme-agent/types.ts
    - Define MemeStyle, GenerationMode, GenerationStage types
    - Define MemeConcept, MemeOutput, GenerationError interfaces
    - Define MemeHistoryItem, GenerationRequest, GenerationResponse interfaces
    - Define MemeDocument interface for MongoDB
    - _Requirements: 17.6_
  
  - [x] 2.2 Create feature directory structure
    - Create /app/meme-agent/components/ directory
    - Create /app/meme-agent/api/ directory
    - Create /app/meme-agent/services/ directory
    - _Requirements: 17.1, 17.3, 17.4, 17.5_

- [x] 3. Implement service layer
  - [x] 3.1 Create meme concept generator service
    - Implement generateMemeConcept function in /app/meme-agent/services/memeConceptGenerator.ts
    - Use Gemini client from /lib/gemini.ts
    - Construct prompt with topic and style parameters
    - Parse JSON response into MemeConcept structure
    - Validate caption/punchline length constraints (max 100 chars)
    - Implement 10-second timeout
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 14.2, 14.3, 17.7, 18.2_
  
  - [x]* 3.2 Write property tests for concept generator
    - **Property 7: Style Parameter Propagation**
    - **Property 9: Concept Structure Constraints**
    - **Property 26: Response Parsing Correctness**
    - **Validates: Requirements 4.4, 6.2, 6.3, 6.4, 14.2, 14.3**
  
  - [x] 3.3 Create meme image generator service
    - Implement generateMemeImage function in /app/meme-agent/services/memeImageGenerator.ts
    - Use NanoBanana client from /lib/nanobanana.ts
    - Send visual description as prompt
    - Return HTTPS URL
    - Validate image resolution (min 800x600)
    - Implement 30-second timeout
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 15.2, 15.3, 17.8, 18.3_
  
  - [x]* 3.4 Write property tests for image generator
    - **Property 10: HTTPS URL Validation**
    - **Property 11: Image Resolution Requirement**
    - **Validates: Requirements 7.3, 7.4, 15.3**
  
  - [x] 3.5 Create meme video generator service
    - Implement generateMemeVideo function in /app/meme-agent/services/memeVideoGenerator.ts
    - Use FFmpeg service from /lib/ffmpeg.ts
    - Download image from URL
    - Add caption overlay (fade-in at 0s, display 0-3s)
    - Add punchline overlay (fade-in at 3s, display 3-6s)
    - Export as MP4 with H.264 codec
    - Upload to storage and return HTTPS URL
    - Clean up temporary files
    - Implement 45-second timeout
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 16.2, 16.3, 16.4, 16.5, 16.6, 16.8, 17.9, 18.4_
  
  - [ ]* 3.6 Write property tests for video generator
    - **Property 12: Video Format and Resolution**
    - **Property 13: Video Text Overlay Presence**
    - **Validates: Requirements 8.2, 8.3, 8.4, 8.5, 8.6, 16.4, 16.5**
  
  - [x] 3.7 Create trending topics service
    - Implement getTrendingTopics function in /app/meme-agent/services/trendingTopicsService.ts
    - Call external Trend Agent API
    - Return 3-10 trending topics
    - Implement 5-minute caching
    - Provide fallback topics if service unavailable
    - Implement 5-second timeout
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 22.2_
  
  - [ ]* 3.8 Write property tests for trending topics service
    - **Property 3: Trending Topics Range**
    - **Property 38: Trending Topics Cache**
    - **Validates: Requirements 2.2, 22.2**

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement API routes
  - [x] 5.1 Create generate meme API route
    - Implement POST handler in /app/meme-agent/api/generate/route.ts
    - Validate request body (mode, topic, style, generateVideo, userId)
    - Call memeConceptGenerator service
    - Call memeImageGenerator service
    - Conditionally call memeVideoGenerator service if video enabled
    - Validate all URLs are accessible
    - Store result in MongoDB
    - Return GenerationResponse
    - Implement 60-second total timeout
    - Handle errors with stage information and retry flag
    - _Requirements: 6.1, 7.1, 8.1, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 13.1, 13.2, 20.1, 20.2, 22.1_
  
  - [ ]* 5.2 Write property tests for generate API
    - **Property 8: Conditional Video Output**
    - **Property 14: Output Structure Completeness**
    - **Property 28: Service Timeout Enforcement**
    - **Property 34: Database Persistence**
    - **Validates: Requirements 5.3, 5.4, 9.1, 9.2, 9.3, 9.4, 9.5, 20.1, 20.2, 22.1**
  
  - [x] 5.3 Create meme history API route
    - Implement GET handler in /app/meme-agent/api/history/route.ts
    - Parse query parameters (userId, page, limit)
    - Query MongoDB for user's memes
    - Order by timestamp descending
    - Implement pagination (20 items per page, max 50)
    - Return paginated response with metadata
    - _Requirements: 20.4, 20.5_
  
  - [ ]* 5.4 Write property tests for history API
    - **Property 35: History Retrieval**
    - **Property 36: History Pagination**
    - **Validates: Requirements 20.4, 20.5**
  
  - [x] 5.5 Create trending topics API route
    - Implement GET handler in /app/meme-agent/api/trending/route.ts
    - Call getTrendingTopics service
    - Return topics array with cache timestamp
    - Handle service unavailability with error response
    - _Requirements: 2.1, 2.3, 2.5_

- [x] 6. Implement UI components
  - [x] 6.1 Create ModeSelector component
    - Implement /app/meme-agent/components/ModeSelector.tsx
    - Render two-option toggle (AI-suggested, Custom)
    - Handle mode change callback
    - Match landing page design system
    - Add ARIA labels for accessibility
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 21.1, 21.2, 21.3, 21.4, 23.4_
  
  - [ ]* 6.2 Write property tests for ModeSelector
    - **Property 1: Mode Selection Persistence**
    - **Property 2: Mode-Specific UI Display**
    - **Validates: Requirements 1.2, 1.3, 1.5**
  
  - [x] 6.3 Create TrendingTopics component
    - Implement /app/meme-agent/components/TrendingTopics.tsx
    - Display 3-10 topics in grid layout
    - Highlight selected topic
    - Show loading state during fetch
    - Display error message if service unavailable
    - Provide refresh button
    - Match landing page design system
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 21.1, 21.2, 21.3, 21.4_
  
  - [ ]* 6.4 Write property tests for TrendingTopics
    - **Property 4: Topic Selection State**
    - **Validates: Requirements 2.4**
  
  - [x] 6.5 Create CustomTopicInput component
    - Implement /app/meme-agent/components/CustomTopicInput.tsx
    - Text input with 3-200 character validation
    - Real-time character count display
    - Show validation error below input
    - Sanitize input to prevent injection attacks
    - Match landing page design system
    - Add ARIA labels for accessibility
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 21.1, 21.2, 21.3, 21.4, 23.4_
  
  - [ ]* 6.6 Write property tests for CustomTopicInput
    - **Property 5: Custom Topic Validation**
    - **Property 6: Input Sanitization**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**
  
  - [x] 6.7 Create StyleSelector component
    - Implement /app/meme-agent/components/StyleSelector.tsx
    - Display three style options (Classic, Modern, Minimalist)
    - Visual indicator for selected style
    - Default selection: Classic
    - Match landing page design system
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 21.1, 21.2, 21.3, 21.4_
  
  - [x] 6.8 Create VideoToggle component
    - Implement /app/meme-agent/components/VideoToggle.tsx
    - Toggle switch component
    - Default state: disabled
    - Clear visual indication of state
    - Match landing page design system
    - Add ARIA labels for accessibility
    - _Requirements: 5.1, 5.2, 5.5, 21.1, 21.2, 21.3, 21.4, 23.4_
  
  - [x] 6.9 Create LoadingIndicator component
    - Implement /app/meme-agent/components/LoadingIndicator.tsx
    - Display descriptive text for current stage (concept, image, video)
    - Animated spinner matching design system
    - ARIA live region for screen reader announcements
    - Match landing page design system
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 21.1, 21.2, 21.3, 21.4, 23.5_
  
  - [ ]* 6.10 Write property tests for LoadingIndicator
    - **Property 19: Loading State Display**
    - **Property 45: Accessibility - Loading Announcements**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 23.5**
  
  - [x] 6.11 Create MemePreview component
    - Implement /app/meme-agent/components/MemePreview.tsx
    - Display image preview with caption below
    - Display video player with controls if video available
    - Allow video replay without regeneration
    - Responsive layout for different screen sizes
    - Use Next.js Image component for optimization
    - Add alt text for images
    - Match landing page design system
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 21.1, 21.2, 21.3, 21.4, 21.6, 22.5, 23.1_
  
  - [ ]* 6.12 Write property tests for MemePreview
    - **Property 15: Preview Display Synchronization**
    - **Property 16: Video Replay Capability**
    - **Property 41: Accessibility - Alt Text**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 23.1**
  
  - [x] 6.13 Create DownloadButtons component
    - Implement /app/meme-agent/components/DownloadButtons.tsx
    - Provide download button for image (always)
    - Provide download button for video (conditional)
    - Initiate file download on click
    - Name files with format "meme_[timestamp].[extension]"
    - Match landing page design system
    - Ensure keyboard accessibility
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 21.1, 21.2, 21.3, 21.4, 23.2_
  
  - [ ]* 6.14 Write property tests for DownloadButtons
    - **Property 17: Conditional Download Button Display**
    - **Property 18: Download Action Triggering**
    - **Validates: Requirements 11.2, 11.3, 11.4, 11.5**
  
  - [x] 6.15 Create ErrorMessage component
    - Implement /app/meme-agent/components/ErrorMessage.tsx
    - Display error message with stage information
    - Provide retry button
    - Match landing page design system
    - Ensure keyboard accessibility
    - _Requirements: 13.1, 13.2, 13.3, 13.6, 21.1, 21.2, 21.3, 21.4, 23.2_
  
  - [ ]* 6.16 Write property tests for ErrorMessage
    - **Property 21: Error Message Display with Stage Information**
    - **Property 22: Retry Mechanism**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4**

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement main page and integration
  - [x] 8.1 Create main page component
    - Implement /app/meme-agent/page.tsx
    - Set up state management with React hooks
    - Integrate all UI components
    - Implement generation flow (validate → concept → image → video → store)
    - Handle mode switching and UI updates
    - Implement error handling with retry logic
    - Disable controls during generation
    - Log errors for debugging
    - Ensure responsive layout
    - Match landing page design system
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 12.6, 13.4, 13.5, 17.2, 21.1, 21.2, 21.3, 21.4, 21.5, 21.6_
  
  - [ ]* 8.2 Write property tests for main page
    - **Property 20: Control Disabling During Generation**
    - **Property 23: Error Logging**
    - **Property 37: Responsive UI Rendering**
    - **Validates: Requirements 12.6, 13.5, 21.6**
  
  - [x] 8.3 Implement lazy loading for history images
    - Add intersection observer for history images
    - Load images only when entering viewport
    - _Requirements: 22.3_
  
  - [ ]* 8.4 Write property tests for lazy loading
    - **Property 39: Lazy Loading for History Images**
    - **Validates: Requirements 22.3**
  
  - [x] 8.5 Implement image compression
    - Add image compression for stored memes
    - Maintain visual quality while reducing file size
    - _Requirements: 22.4_
  
  - [ ]* 8.6 Write property tests for image compression
    - **Property 40: Image Compression**
    - **Validates: Requirements 22.4**

- [x] 9. Add accessibility features
  - [x] 9.1 Ensure keyboard navigation for all interactive elements
    - Add tabindex attributes where needed
    - Implement keyboard event handlers (Enter, Space)
    - Test focus management
    - _Requirements: 23.2_
  
  - [ ]* 9.2 Write property tests for keyboard navigation
    - **Property 42: Accessibility - Keyboard Navigation**
    - **Validates: Requirements 23.2**
  
  - [x] 9.3 Verify color contrast ratios
    - Audit all text elements for 4.5:1 contrast ratio
    - Adjust colors if needed to meet WCAG 2.1 Level AA
    - _Requirements: 23.3_
  
  - [ ]* 9.4 Write property tests for color contrast
    - **Property 43: Accessibility - Color Contrast**
    - **Validates: Requirements 23.3**
  
  - [x] 9.5 Add visible focus indicators
    - Ensure all interactive elements show focus state
    - Use outline, border, or background change
    - _Requirements: 23.6_
  
  - [ ]* 9.6 Write property tests for focus indicators
    - **Property 46: Accessibility - Focus Indicators**
    - **Validates: Requirements 23.6**
  
  - [x] 9.7 Add ARIA labels to form controls
    - Add aria-label or aria-labelledby to all inputs, selects, toggles
    - _Requirements: 23.4_
  
  - [ ]* 9.8 Write property tests for ARIA labels
    - **Property 44: Accessibility - ARIA Labels**
    - **Validates: Requirements 23.4**

- [x] 10. Environment configuration and validation
  - [x] 10.1 Create environment variable validation
    - Validate GEMINI_API_KEY at startup
    - Validate NANOBANANA_API_KEY at startup
    - Validate MONGODB_URI at startup
    - Display configuration errors if missing
    - _Requirements: 19.1, 19.2, 19.3, 19.4_
  
  - [ ]* 10.2 Write property tests for environment validation
    - **Property 32: Environment Variable Validation at Startup**
    - **Validates: Requirements 19.4**
  
  - [x] 10.3 Ensure API key security
    - Audit error messages to prevent API key exposure
    - Audit log entries to prevent API key exposure
    - Audit API responses to prevent API key exposure
    - _Requirements: 19.5_
  
  - [ ]* 10.4 Write property tests for API key security
    - **Property 33: API Key Security**
    - **Validates: Requirements 19.5**
  
  - [x] 10.5 Create .env.example file
    - Document all required environment variables
    - Provide example values (not real keys)
    - Include setup instructions

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests should be added for specific examples and edge cases
- All code should follow Next.js App Router patterns and TypeScript best practices
- UI components should match the existing landing page design system
- Shared libraries in /lib/ enable reuse across features
