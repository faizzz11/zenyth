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

const POLL_INTERVAL_MS = 8000; // Increased to 8 seconds
const MAX_POLL_TIME_MS = 240000; // Increased to 4 minutes (240 seconds)

async function pollForResult(taskId: string): Promise<string> {
  const startTime = Date.now();
  let pollCount = 0;

  while (Date.now() - startTime < MAX_POLL_TIME_MS) {
    pollCount++;
    console.log(`Polling attempt ${pollCount} for taskId: ${taskId}`);
    
    try {
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
        console.error(`Suno poll request failed with status ${response.status}`);
        // Don't throw immediately, continue polling
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        continue;
      }

      const data: SunoRecordInfoResponse = await response.json();
      console.log(`Poll response status: ${data.data?.status}`);

      if (data.data?.status === 'complete' || data.data?.response?.sunoData?.[0]?.audioUrl) {
        const audioUrl = data.data.response.sunoData[0]?.audioUrl;
        if (audioUrl) {
          console.log('Music generation complete, audioUrl received');
          return audioUrl;
        }
      }

      if (data.data?.status === 'failed' || data.data?.status === 'error') {
        throw new Error('Suno music generation failed with status: ' + data.data?.status);
      }

      // Status is still processing, continue polling
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    } catch (error) {
      console.error('Error during polling:', error);
      // Continue polling unless it's a fatal error
      if (error instanceof Error && error.message.includes('failed with status')) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
  }

  throw new Error('Music generation timed out after 4 minutes. The generation may still be processing on Suno servers.');
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
      const errorText = await response.text();
      console.error('Suno API error response:', errorText);
      throw new Error(`Suno generate request failed with status ${response.status}: ${errorText}`);
    }

    const data: SunoGenerateResponse = await response.json();
    const taskId = data.data?.taskId;

    if (!taskId) {
      throw new Error('No taskId returned from Suno API');
    }

    console.log('Suno taskId:', taskId, '— polling for result...');

    const audioUrl = await pollForResult(taskId);
    return audioUrl;
  } catch (error) {
    safeError('Music generation failed:', error);
    throw error;
  }
}
