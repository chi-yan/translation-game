import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TranslationQuestion } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ExportQuestionsProps {
  className?: string;
}

export default function ExportQuestions({ className }: ExportQuestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // Fetch all questions from the API
      const response = await apiRequest("GET", "/api/questions");
      const questions: TranslationQuestion[] = await response.json();

      // Convert to JSON string
      const jsonData = JSON.stringify(questions, null, 2);
      
      // Create blob and download link
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `chinese-translation-questions-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Exported ${questions.length} questions to JSON file.`,
      });
    } catch (error) {
      console.error("Error exporting questions:", error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={isLoading}
      variant="outline"
      className={`bg-white hover:bg-gray-100 text-neutral ${className}`}
    >
      {isLoading ? "Exporting..." : "Export Questions"}
    </Button>
  );
}