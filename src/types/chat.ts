export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const availableModels: ChatModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Modelo más avanzado y capaz'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Rápido y eficiente'
  },
  {
    id: 'custom-model',
    name: 'Modelo Personalizado',
    description: 'Tu modelo personalizado'
  }
];