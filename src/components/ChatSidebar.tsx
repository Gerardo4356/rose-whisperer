import { useState } from 'react';
import { Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

export const ChatSidebar = () => {
  const { 
    conversations, 
    currentConversation, 
    createNewConversation, 
    selectConversation, 
    deleteConversation 
  } = useChat();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn(
      "bg-chat-sidebar border-r border-border flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">Conversaciones</h2>
          )}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={createNewConversation}
              className="chat-gradient text-primary-foreground hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              {!isCollapsed && <span className="ml-1">Nueva</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? 
                <ChevronRight className="w-4 h-4" /> : 
                <ChevronLeft className="w-4 h-4" />
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="p-2 space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-secondary",
                currentConversation?.id === conversation.id && "bg-secondary border-l-4 border-primary"
              )}
              onClick={() => selectConversation(conversation.id)}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(conversation.updatedAt)}
                    </p>
                    {conversation.messages.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {conversation.messages[conversation.messages.length - 1].content}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conversation.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
          
          {conversations.length === 0 && !isCollapsed && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay conversaciones</p>
              <p className="text-xs mt-1">Crea una nueva para empezar</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};