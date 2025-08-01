import { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/hooks/useChat';
import { ModelSelector } from './ModelSelector';

export const ChatInput = () => {
  const { sendMessage, isTyping, currentConversation, createNewConversation } = useChat();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const messageToSend = message.trim();
    setMessage('');
    
    // Resetear altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    if (!currentConversation) {
      createNewConversation();
      // Esperar un poco para que se cree la conversación
      setTimeout(() => {
        sendMessage(messageToSend);
      }, 100);
    } else {
      await sendMessage(messageToSend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-border bg-chat-background p-4">
      {/* Model Selector */}
      <div className="mb-4 flex justify-center">
        <ModelSelector />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-4xl mx-auto">
        {/* New Chat Button */}
        {!currentConversation && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={createNewConversation}
            className="flex-shrink-0 bg-chat-input border-border hover:bg-secondary"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentConversation ? "Escribe tu mensaje..." : "Comienza una nueva conversación..."}
            className="min-h-[52px] max-h-32 resize-none bg-chat-input border-border focus:border-primary pr-12 scrollbar-thin"
            disabled={isTyping}
          />
          
          {/* Send Button */}
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isTyping}
            className="absolute bottom-2 right-2 chat-gradient text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground text-center mt-3 max-w-4xl mx-auto">
        Presiona Enter para enviar, Shift + Enter para nueva línea
      </p>
    </div>
  );
};