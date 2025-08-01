import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, Conversation, ChatModel, availableModels } from '@/types/chat';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  selectedModel: ChatModel;
  isTyping: boolean;
  createNewConversation: () => void;
  selectConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  setSelectedModel: (model: ChatModel) => void;
  deleteConversation: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [selectedModel, setSelectedModel] = useState<ChatModel>(availableModels[0]);
  const [isTyping, setIsTyping] = useState(false);

  // Cargar conversaciones del localStorage al iniciar
  useEffect(() => {
    const savedConversations = localStorage.getItem('chat-conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations).map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setConversations(parsed);
      if (parsed.length > 0) {
        setCurrentConversation(parsed[0]);
      }
    }
  }, []);

  // Guardar conversaciones en localStorage cuando cambien
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chat-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== id);
      if (currentConversation?.id === id) {
        setCurrentConversation(filtered.length > 0 ? filtered[0] : null);
      }
      return filtered;
    });
  };

  const generateAssistantResponse = async (userMessage: string): Promise<string> => {
    // Simulación de respuesta del asistente
    // En una implementación real, aquí llamarías a tu API
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      `Entiendo tu consulta sobre "${userMessage}". Como asistente basado en ${selectedModel.name}, puedo ayudarte con eso.`,
      `Excelente pregunta. Usando ${selectedModel.name}, puedo proporcionarte una respuesta detallada.`,
      `Gracias por tu mensaje. Con ${selectedModel.name}, analizo tu consulta y te respondo de la mejor manera.`,
      `Perfecto. Permíteme procesar tu solicitud usando ${selectedModel.name} para darte la mejor respuesta posible.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async (content: string) => {
    if (!currentConversation) {
      createNewConversation();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Actualizar título si es el primer mensaje
    let updatedTitle = currentConversation.title;
    if (currentConversation.messages.length === 0) {
      updatedTitle = content.slice(0, 50) + (content.length > 50 ? '...' : '');
    }

    // Agregar mensaje del usuario
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversation.id 
        ? { 
            ...conv, 
            title: updatedTitle,
            messages: [...conv.messages, userMessage],
            updatedAt: new Date()
          }
        : conv
    ));

    // Actualizar conversación actual
    const updatedConversation = {
      ...currentConversation,
      title: updatedTitle,
      messages: [...currentConversation.messages, userMessage],
      updatedAt: new Date()
    };
    setCurrentConversation(updatedConversation);

    // Mostrar indicador de escritura
    setIsTyping(true);

    try {
      // Generar respuesta del asistente
      const assistantResponse = await generateAssistantResponse(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      // Agregar respuesta del asistente
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversation.id 
          ? { 
              ...conv, 
              messages: [...updatedConversation.messages, assistantMessage],
              updatedAt: new Date()
            }
          : conv
      ));

      // Actualizar conversación actual
      setCurrentConversation(prev => prev ? {
        ...prev,
        messages: [...updatedConversation.messages, assistantMessage],
        updatedAt: new Date()
      } : null);

    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const value: ChatContextType = {
    conversations,
    currentConversation,
    selectedModel,
    isTyping,
    createNewConversation,
    selectConversation,
    sendMessage,
    setSelectedModel,
    deleteConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};