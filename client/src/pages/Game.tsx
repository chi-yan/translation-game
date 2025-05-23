import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type TranslationQuestion } from "@shared/schema";
import GameContainer from "@/components/GameContainer";
import AdminPanel from "@/components/AdminPanel";

export default function Game() {
  const [gameState, setGameState] = useState<"loading" | "playing" | "results">("loading");
  const [showAdmin, setShowAdmin] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch questions from the API
  const { data: questions, isLoading, isError, error, refetch } = useQuery<TranslationQuestion[]>({
    queryKey: ["/api/questions"],
    staleTime: 60000,
  });
  
  // Set game state based on query status
  useEffect(() => {
    if (questions && !isLoading) {
      setGameState("playing");
    } else if (isError) {
      setGameState("loading");
    }
  }, [questions, isLoading, isError]);

  const handleRestart = async () => {
    setGameState("loading");
    await queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
    await refetch();
  };

  const toggleAdmin = () => {
    setShowAdmin(!showAdmin);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral mb-2">Chinese Translation Game</h1>
          <p className="text-neutral/80">Test your Chinese to English translation skills!</p>
          <button 
            onClick={toggleAdmin}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600"
          >
            {showAdmin ? "Hide Admin" : "Admin"}
          </button>
        </header>

        {/* Admin Panel (only shown when toggled) */}
        {showAdmin && <AdminPanel />}

        {/* Game Content */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg">Loading questions...</p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-error">Error loading questions: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 bg-primary hover:bg-secondary text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Try Again
            </button>
          </div>
        ) : (
          <GameContainer questions={questions || []} onRestart={handleRestart} />
        )}

        {/* Footer */}
        <footer className="text-center text-neutral/60 text-sm mt-8">
          <p>Chinese translation game focusing on HSK 2-4 level sentences.</p>
        </footer>
      </div>
    </div>
  );
}
