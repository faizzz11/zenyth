export interface VideoRequest {
  url: string;
}

export interface JobStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  video_url?: string;
  error?: string;
}

export interface GeneratedShort {
  id: string;
  jobId: string;
  originalUrl: string;
  videoUrl?: string;
  status: JobStatus['status'];
  createdAt: Date;
  error?: string;
}
