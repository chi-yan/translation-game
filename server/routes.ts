import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { translationQuestionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the translation game
  
  // Get a set of questions for a new game session
  app.get("/api/questions", async (req, res) => {
    try {
      // Always return 10 questions for a game session
      const questions = await storage.getQuestions(10);
      
      if (questions.length < 10) {
        res.status(500).json({ 
          message: "Not enough questions available. Please add more questions." 
        });
        return;
      }
      
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });
  
  // Add a new question
  app.post("/api/questions", async (req, res) => {
    try {
      // Validate request body
      const questionData = translationQuestionSchema.omit({ id: true }).safeParse(req.body);
      
      if (!questionData.success) {
        res.status(400).json({ 
          message: "Invalid question data", 
          errors: questionData.error.errors 
        });
        return;
      }
      
      const newQuestion = await storage.addQuestion(questionData.data);
      res.status(201).json(newQuestion);
    } catch (error) {
      console.error("Error adding question:", error);
      res.status(500).json({ message: "Failed to add question" });
    }
  });

  // Generate a new question using DeepSeek API
  app.post("/api/generate-question", async (req, res) => {
    try {
      // This route would typically call the DeepSeek API
      // For initial implementation, we'll return a message that this functionality is coming soon
      res.status(501).json({ 
        message: "Question generation with DeepSeek API will be implemented soon." 
      });
    } catch (error) {
      console.error("Error generating question:", error);
      res.status(500).json({ message: "Failed to generate question" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
