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
      const apiKey = process.env.DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        return res.status(400).json({ 
          message: "DeepSeek API key is not configured. Please add it to your environment variables." 
        });
      }
      
      // Make request to DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a Chinese language teacher creating content for a translation game. Generate a Chinese sentence at HSK 2-4 level with its pinyin and English translation. Also provide 3 incorrect English translations that are plausible but not correct.'
            },
            {
              role: 'user',
              content: 'Please create a Chinese-English translation question by returning a JSON object with the following format: {"chinese": "Chinese sentence", "pinyin": "Pinyin for the sentence", "options": ["Correct English translation", "Incorrect option 1", "Incorrect option 2", "Incorrect option 3"], "correctIndex": 0}'
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      
      const data = await response.json();
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        return res.status(500).json({ message: "Invalid response from DeepSeek API" });
      }
      
      try {
        // Extract the JSON object from the response
        const content = data.choices[0].message.content;
        // Attempt to extract JSON from the response
        let jsonMatch = null;
        try {
          jsonMatch = content.match(/\{[\s\S]*\}/);
        } catch (err) {
          console.error("Error in first regex match:", err);
        }
        
        let questionData;
        if (jsonMatch) {
          questionData = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON object is found, try to parse the entire content
          questionData = JSON.parse(content);
        }
        
        // Validate the question data
        if (!questionData.chinese || !questionData.pinyin || !Array.isArray(questionData.options) || 
            questionData.options.length !== 4 || typeof questionData.correctIndex !== 'number') {
          throw new Error("Invalid question format");
        }
        
        // Add the generated question to storage
        const newQuestion = await storage.addQuestion(questionData);
        
        res.status(201).json(newQuestion);
      } catch (parseError) {
        console.error("Error parsing DeepSeek response:", parseError, data.choices[0].message.content);
        res.status(500).json({ message: "Failed to parse generated question" });
      }
    } catch (error) {
      console.error("Error generating question:", error);
      res.status(500).json({ message: "Failed to generate question" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
