import { safeError } from '@/lib/securityUtils';
import { sunoConfig } from '@/lib/suno';

interface MusicGenerationParams {
  styleDescription: string;
  bpm: number;
  duration: number;
}

interface SunoGenerateResponse {
  code: number;
  data: {
    taskId: string;
  };
}

interface SunoRecordInfoResponse {
  code: number;
  data: {
    response: {
      sunoData: Array<{
        audioUrl: string;
        title?: string;
        duration?: number;
      }>;
    };
    status: string;
  };
}

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_TIME_MS = 120000;

async function pollForResult(taskId: string): Promise<string> {
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_POLL_TIME_MS) {
    const response = await fetch(
      `${sunoConfig.baseUrl}/api/v1/generate/record-info?taskId=${taskId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sunoConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Suno poll request failed with status ${response.status}`);
    }

    const data: SunoRecordInfoResponse = await response.json();

    if (data.data?.status === 'complete' || data.data?.response?.sunoData?.[0]?.audioUrl) {
      const audioUrl = data.data.response.sunoData[0]?.audioUrl;
      if (audioUrl) {
        return audioUrl;
      }
    }

    if (data.data?.status === 'failed' || data.data?.status === 'error') {
      throw new Error('Suno music generation failed');
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error('Music generation timed out after 120 seconds');
}

export async function generateMusic(params: MusicGenerationParams): Promise<string> {
  if (!sunoConfig.apiKey) {
    throw new Error('SUNO_API_KEY environment variable is not set');
  }

  try {
    console.log('Requesting Suno music generation:', params.styleDescription);

    const response = await fetch(`${sunoConfig.baseUrl}/api/v1/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sunoConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.styleDescription,
        customMode: false,
        instrumental: false,
        callBackUrl: 'https://example.com/callback',
        model: 'V4_5ALL',
      }),
    });

    if (!response.ok) {
      throw new Error(`Suno generate request failed with status ${response.status}`);
    }

    const data: SunoGenerateResponse = await response.json();
    const taskId = data.data?.taskId;

    if (!taskId) {
      throw new Error('No taskId returned from Suno API');
    }

    console.log('Suno taskId:', taskId, '— polling for result...');

    const audioUrl = await pollForResult(taskId);
    console.log('Music generation complete, audioUrl received');

    return audioUrl;
  } catch (error) {
    safeError('Music generation failed:', error);
    throw error;
  }
}
