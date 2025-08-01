import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useChat } from '@/hooks/useChat';
import { MessageSquare } from 'lucide-react';

export const ChatArea = () => {
  const { currentConversation, isTyping } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll al último mensaje
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages, isTyping]);

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-background">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full chat-gradient flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Hola! Soy tu asistente IA</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Estoy aquí para ayudarte con cualquier pregunta o tarea que tengas. 
            ¿En qué puedo asistirte hoy?
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-chat-background">
      <ScrollArea ref={scrollAreaRef} className="flex-1 scrollbar-thin">
        <div className="max-w-4xl mx-auto p-4">
          {currentConversation.messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full chat-gradient flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nueva conversación</h3>
              <p className="text-muted-foreground">
                Escribe tu primer mensaje para comenzar
              </p>
            </div>
          ) : (
            currentConversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          
          {isTyping && <TypingIndicator />}
          
          {/* Elemento para hacer scroll automático */}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};