import { apiRequest } from "./queryClient";
import { type TranslationQuestion } from "@shared/schema";

/**
 * Fetches a set of translation questions from the API
 */
export const fetchQuestions = async (): Promise<TranslationQuestion[]> => {
  const response = await apiRequest("GET", "/api/questions");
  return await response.json();
};

/**
 * Submits a new question to the API
 */
export const addQuestion = async (question: Omit<TranslationQuestion, "id">): Promise<TranslationQuestion> => {
  const response = await apiRequest("POST", "/api/questions", question);
  return await response.json();
};

/**
 * Generates a new question using DeepSeek API
 */
export const generateQuestion = async (): Promise<TranslationQuestion> => {
  const response = await apiRequest("POST", "/api/generate-question");
  return await response.json();
};

/**
 * Utility function to shuffle an array (for randomizing options)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
