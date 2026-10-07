export interface NovaRequest {
  message: string;
  conversationId?: string;
  context?: Record<string, unknown>;
}

export interface NovaMetadata {
  status: 'stub' | 'invalid_request' | 'method_not_allowed';
  backendConnected: boolean;
  requestReceivedAt?: string;
  mode?: 'development' | 'production';
  model?: string | null;
  messageLength?: number;
  contextKeys?: string[];
}

export interface NovaResponse {
  success: boolean;
  response: string;
  conversationId: string;
  metadata: NovaMetadata;
  error?: string;
}
