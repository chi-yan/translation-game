import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateQuestion } from "@/lib/gameService";
import { TranslationQuestion } from "@shared/schema";

export default function AdminPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateQuestion = async () => {
    setIsGenerating(true);
    try {
      const newQuestion = await generateQuestion();
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
      <div className="flex gap-2">
        <Button 
          onClick={handleGenerateQuestion} 
          disabled={isGenerating}
          variant="outline"
          className="bg-white hover:bg-gray-100 text-neutral"
        >
          {isGenerating ? "Generating..." : "Generate New Question"}
        </Button>
      </div>
    </div>
  );
}