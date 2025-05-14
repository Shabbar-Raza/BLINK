export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SavedNote {
  id: string;
  content: string;
  timestamp: Date;
}

export interface Topic {
  _id: string;
  title: string;
  courseId: string;
  fileUrl?: string;
  fileType?: string;
  content?: string;
  generatedNotes?: string;
  savedNotes?: SavedNote[];
  chatHistory?: Message[];
  created_at: Date;
}

export interface Course {
  _id: string;
  userId: string;
  title: string;
  icon: string;
  bgColor: string;
  progress: number;
  created_at: Date;
  topics?: Topic[];
} 