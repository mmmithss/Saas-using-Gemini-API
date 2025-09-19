import {GoogleGenAI} from "@google/genai";

const ai = new GoogleGenAI({});

const userData = [
      {
        role: "user",
        parts: [{ text: "Hello, I have 2 dogs they are named dev and rani" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ];

export async function createChat(history: Array<any>) {
  
  return await ai.chats.create({
    model: "gemini-2.5-flash",
    history: history.length > 0 ? history : userData,
    
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    },
  });


}