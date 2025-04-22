import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateQuestion } from "@/lib/gameService";
import { TranslationQuestion } from "@shared/schema";
import ExportQuestions from "./ExportQuestions";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleGenerateQuestion = async () => {
    setIsGenerating(true);
    try {
      const newQuestion = await generateQuestion();
      
      // Invalidate the questions cache to refresh the game
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      
      toast({
        title: "Question Generated Successfully",
        description: `New question added: "${newQuestion.chinese}"`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating question:", error);
      toast({
        title: "Failed to generate question",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-medium mb-2">Admin Controls</h2>
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={handleGenerateQuestion} 
          disabled={isGenerating}
          variant="outline"
          className="bg-white hover:bg-gray-100 text-neutral"
        >
          {isGenerating ? "Generating..." : "Generate New Question"}
        </Button>
        
        <ExportQuestions />
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <p>Note: New questions generated with DeepSeek AI will be added to the question pool.</p>
      </div>
    </div>
  );
}