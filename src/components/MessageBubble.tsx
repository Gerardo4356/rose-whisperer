import { Message } from '@/types/chat';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex w-full mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[80%] gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser 
            ? "chat-gradient" 
            : "bg-secondary"
        )}>
          {isUser ? (
            <User className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Bot className="w-4 h-4 text-foreground" />
          )}
        </div>

        {/* Message Content */}
        <div className={cn(
          "rounded-lg px-4 py-3 shadow-sm",
          isUser 
            ? "bg-chat-message-user text-primary-foreground" 
            : "bg-chat-message-assistant text-foreground"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          <p className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-primary-foreground" : "text-muted-foreground"
          )}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};