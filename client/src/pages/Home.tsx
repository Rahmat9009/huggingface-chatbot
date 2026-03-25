import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/chat");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            HuggingFace Chatbot
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Experience intelligent conversations powered by state-of-the-art NLP
          </p>
          <p className="text-sm text-muted-foreground">
            Built with HuggingFace Transformers and modern web technologies
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-6"
          >
            Sign In to Start Chatting
          </Button>
          <p className="text-xs text-muted-foreground">
            Sign in with your Manus account to begin
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Features
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Real-time AI conversations</li>
            <li>✓ Message history and context</li>
            <li>✓ Responsive design</li>
            <li>✓ Error handling and recovery</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
