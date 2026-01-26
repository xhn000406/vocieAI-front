/**
 * 类型定义
 */

export interface Meeting {
  id: string;
  title: string;
  createdAt: Date;
  duration: number; // 秒
  audioUrl?: string;
  transcript: TranscriptItem[];
  summary?: MeetingSummary;
  tags: string[];
  speakers?: Speaker[];
  isArchived: boolean;
}

export interface TranscriptItem {
  id: string;
  timestamp: number; // 秒
  text: string;
  speakerId?: string;
  speakerName?: string;
  isHighlighted?: boolean;
}

export interface MeetingSummary {
  keywords: string[];
  summary: string;
  todos: TodoItem[];
  lastUpdated: Date;
}

export interface TodoItem {
  id: string;
  text: string;
  assignee?: string;
  dueDate?: Date;
  completed: boolean;
}

export interface Speaker {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  subscription: 'free' | 'pro';
  lastSyncAt?: Date;
  storageUsed: number; // MB
}

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped';

export interface RecordingState {
  status: RecordingStatus;
  startTime?: Date;
  duration: number; // 秒
  transcript: TranscriptItem[];
  currentSummary?: MeetingSummary;
}

