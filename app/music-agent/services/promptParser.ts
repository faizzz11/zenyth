import { MusicMood, MusicTempo, MusicGenre } from '../types';

interface ParsedPrompt {
  mood: MusicMood;
  tempo: MusicTempo;
  bpm?: number;
  genre: MusicGenre;
  styleDescription: string;
}

export function parsePromptToParameters(
  mood: MusicMood,
  tempo: MusicTempo,
  genre: MusicGenre,
  singerStyle: string | undefined,
  freeTextPrompt: string | undefined
): ParsedPrompt {
  let finalMood = mood;
  let finalTempo = tempo;
  let finalGenre = genre;
  let bpm: number | undefined;
  
  // Map tempo to BPM ranges
  const tempoBpmMap: Record<MusicTempo, number> = {
    slow: 70,
    medium: 110,
    fast: 140,
  };
  
  bpm = tempoBpmMap[tempo];
  
  // Build style description for Lyria
  const styleElements: string[] = [];
  
  // Add genre-specific characteristics
  const genreDescriptions: Record<MusicGenre, string> = {
    rap: 'Hip hop beat with rhythmic percussion',
    pop: 'Catchy melody with modern production',
    classical: 'Orchestral arrangement with rich harmonies',
    bollywood: 'Indian classical fusion with tabla and sitar',
    rock: 'Electric guitar with driving drums',
    lofi: 'Lo-fi hip hop with mellow beats and jazzy chords',
    jazz: 'Jazz fusion with improvisation',
    electronic: 'Electronic synths with dance beats',
    folk: 'Acoustic instruments with organic feel',
  };
  
  styleElements.push(genreDescriptions[genre]);
  
  // Add mood characteristics
  const moodDescriptions: Record<MusicMood, string> = {
    romantic: 'warm tones, smooth melody, emotional',
    sad: 'melancholic, minor key, subdued',
    energetic: 'upbeat, bright, dynamic',
    aggressive: 'intense, heavy, powerful',
    nostalgic: 'dreamy, vintage, reflective',
    chill: 'relaxed, ambient, peaceful',
    upbeat: 'happy, lively, positive',
  };
  
  styleElements.push(moodDescriptions[mood]);
  
  // Add singer style influence (instrumental interpretation)
  if (singerStyle) {
    styleElements.push(`in the musical style reminiscent of ${singerStyle}`);
  }
  
  const styleDescription = styleElements.join(', ');
  
  return {
    mood: finalMood,
    tempo: finalTempo,
    bpm,
    genre: finalGenre,
    styleDescription,
  };
}
