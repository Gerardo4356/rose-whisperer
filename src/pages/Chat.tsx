import { ChatProvider } from '@/hooks/useChat';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatArea } from '@/components/ChatArea';
import { ChatInput } from '@/components/ChatInput';

const Chat = () => {
  return (
    <ChatProvider>
      <div className="h-screen flex bg-chat-background">
        <ChatSidebar />
        <div className="flex-1 flex flex-col">
          <ChatArea />
          <ChatInput />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Chat;