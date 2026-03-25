import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ConversationList from "@/components/ConversationList";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Create conversation mutation
  const createConversationMutation = trpc.chat.createConversation.useMutation({
    onSuccess: (result) => {
      if (result) {
        setSelectedConversationId(result.id);
      }
    },
  });

  const handleCreateNew = () => {
    createConversationMutation.mutate({
      title: `Chat - ${new Date().toLocaleDateString()}`,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Welcome to HuggingFace Chatbot
          </h1>
          <p className="text-muted-foreground mb-8">
            Please log in to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 overflow-hidden border-r border-border`}
      >
        <ConversationList
          selectedId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          onCreateNew={handleCreateNew}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-card">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-foreground">
              HuggingFace Chatbot
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">{user?.name}</div>
        </div>

        {/* Chat Area */}
        {selectedConversationId ? (
          <ChatInterface conversationId={selectedConversationId} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No conversation selected
            </h2>
            <p className="text-muted-foreground mb-6">
              Create a new chat or select one from the sidebar to get started
            </p>
            <Button
              onClick={handleCreateNew}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Start New Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
