import { Button } from "@/components/ui/button";

interface ResultsCardProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export default function ResultsCard({ score, totalQuestions, onRestart }: ResultsCardProps) {
  // Determine message based on score
  const getMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    
    if (percentage >= 80) {
      return "Excellent! You have a great understanding of Chinese!";
    } else if (percentage >= 50) {
      return "Good job! You're making solid progress with your Chinese!";
    } else {
      return "Keep practicing! You'll improve your Chinese skills with more study.";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-2xl font-bold text-neutral mb-4">Game Complete!</h2>
      
      <div className="text-5xl font-bold text-primary mb-4">
        {score}/{totalQuestions}
      </div>
      
      <p className="text-neutral mb-6">{getMessage()}</p>
      
      <Button
        onClick={onRestart}
        className="bg-primary hover:bg-secondary text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
      >
        Play Again
      </Button>
    </div>
  );
}
