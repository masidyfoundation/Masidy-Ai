export interface TelemetryLog {
  timestamp: string;
  step: string;
  details: string;
  status: "INFO" | "WARNING" | "SUCCESS";
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "system" | "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface ProjectFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export interface MasidyModel {
  id: string;
  name: string;
  description: string;
}

export interface ImageGeneration {
  id: string;
  prompt: string;
  url: string;
  timestamp: string;
}

export interface ResearchResult {
  query: string;
  summary: string;
  url?: string;
  timestamp: string;
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  language: string;
}
