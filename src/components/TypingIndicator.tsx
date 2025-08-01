import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex w-full mb-6">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary">
          <Bot className="w-4 h-4 text-foreground" />
        </div>

        {/* Typing Animation */}
        <div className="bg-chat-message-assistant rounded-lg px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dots animate-pulse"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dots animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dots animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};