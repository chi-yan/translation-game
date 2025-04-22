import { useState } from "react";
import { type TranslationQuestion } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: TranslationQuestion;
  selectedOption: number | null;
  hasAnswered: boolean;
  onSelectOption: (optionIndex: number) => void;
  onNextQuestion: () => void;
}

export default function QuestionCard({
  question,
  selectedOption,
  hasAnswered,
  onSelectOption,
  onNextQuestion,
}: QuestionCardProps) {
  const [showPinyin, setShowPinyin] = useState(false);

  const togglePinyin = () => {
    setShowPinyin(!showPinyin);
  };

  const getOptionClassName = (index: number) => {
    if (!hasAnswered) {
      return "w-full text-left p-4 border border-gray-300 rounded-md hover:border-primary focus:outline-none focus:border-primary transition-colors";
    }

    if (index === question.correctIndex) {
      return "w-full text-left p-4 border-2 border-success bg-success text-white rounded-md transition-colors";
    }

    if (index === selectedOption && index !== question.correctIndex) {
      return "w-full text-left p-4 border-2 border-error bg-error text-white rounded-md transition-colors";
    }

    return "w-full text-left p-4 border border-gray-300 rounded-md opacity-70 transition-colors";
  };

  return (
    <div className="mb-6">
      <div className="text-center mb-4">
        {/* Chinese Text */}
        <div className="text-2xl mb-2 font-medium">{question.chinese}</div>
        
        {/* Pinyin Toggle */}
        <div className="mb-4">
          <button
            onClick={togglePinyin}
            className="text-primary hover:text-secondary text-sm focus:outline-none focus:underline"
          >
            {showPinyin ? "Hide Pinyin" : "Show Pinyin"}
          </button>
        </div>
        
        {/* Pinyin Text */}
        <div className={cn("text-base text-gray-600 mb-4", !showPinyin && "hidden")}>
          {question.pinyin}
        </div>
      </div>

      {/* Translation Question */}
      <div className="text-neutral text-lg text-center mb-4">
        Choose the correct English translation:
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(index)}
            disabled={hasAnswered}
            className={getOptionClassName(index)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="flex justify-center mt-6">
        {hasAnswered && (
          <Button 
            onClick={onNextQuestion}
            className="bg-primary hover:bg-secondary text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
}
