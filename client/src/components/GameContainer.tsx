import { useState } from "react";
import { type TranslationQuestion } from "@shared/schema";
import QuestionCard from "./QuestionCard";
import ResultsCard from "./ResultsCard";

interface GameContainerProps {
  questions: TranslationQuestion[];
  onRestart: () => void;
}

export default function GameContainer({ questions, onRestart }: GameContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "results">("playing");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelectOption = (optionIndex: number) => {
    if (hasAnswered) return;
    
    setSelectedOption(optionIndex);
    setHasAnswered(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setGameState("results");
    }
  };

  const handleRestartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState("playing");
    setSelectedOption(null);
    setHasAnswered(false);
    onRestart();
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-lg">No questions available. Please try again later.</p>
        <button
          onClick={onRestart}
          className="mt-4 bg-primary hover:bg-secondary text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {gameState === "playing" ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-neutral font-medium">
              Question <span>{currentQuestionIndex + 1}</span> of 10
            </div>
            <div className="text-neutral font-medium">
              Score: <span>{score}</span>
            </div>
          </div>

          {/* Question Card */}
          <QuestionCard
            question={questions[currentQuestionIndex]}
            selectedOption={selectedOption}
            hasAnswered={hasAnswered}
            onSelectOption={handleSelectOption}
            onNextQuestion={handleNextQuestion}
          />
        </div>
      ) : (
        <ResultsCard score={score} totalQuestions={questions.length} onRestart={handleRestartGame} />
      )}
    </div>
  );
}
