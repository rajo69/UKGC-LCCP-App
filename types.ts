export interface Source {
  condition: string;
  context: string;
  links: string[];
}

export interface ApiResponse {
  answer: string;
  sources: Source[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: number;
  isError?: boolean;
}

export interface ApiErrorResponse {
  detail: {
    loc: (string | number)[];
    msg: string;
    type: string;
  }[];
}
