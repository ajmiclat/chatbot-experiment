import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import fs from "fs";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";

// Create Hono app
const app = new Hono();

// Enable CORS
app.use("*", cors());

// Context file path
const CONTEXT_FILE_PATH = "./context.txt";

// Initialize Ollama model using the proper package
const ollama = new Ollama({
  baseUrl: "http://localhost:11434", // Default Ollama URL
  model: "llama3", // Using llama3 as the model (you can change it)
  temperature: 0.7,
});

// Function to read context from file
function readContextFromFile(): string {
  try {
    if (fs.existsSync(CONTEXT_FILE_PATH)) {
      return fs.readFileSync(CONTEXT_FILE_PATH, "utf-8");
    }
    return "";
  } catch (error) {
    console.error("Error reading context file:", error);
    return "";
  }
}

// Function to update context file
function updateContextFile(content: string): boolean {
  try {
    fs.writeFileSync(CONTEXT_FILE_PATH, content);
    return true;
  } catch (error) {
    console.error("Error writing to context file:", error);
    return false;
  }
}

// Routes
app.get("/", (c) => {
  return c.text("Chatbot API is running!");
});

// Get current context
app.get("/context", (c) => {
  const context = readContextFromFile();
  return c.json({ context });
});

// Update context
app.post("/context", async (c) => {
  const { context } = await c.req.json();
  const success = updateContextFile(context);
  return c.json({ success });
});

// Chat endpoint
app.post("/chat", async (c) => {
  try {
    const { message } = await c.req.json();
    const context = readContextFromFile();
    
    // Create a system prompt with context
    const systemPrompt = `You are a helpful AI assistant. 
      ${context ? "Here is some additional context you should use to answer questions:\n" + context : ""}
      Be concise and helpful in your responses.`;
    
    // Create the prompt
    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
    
    // Execute the model call
    const response = await ollama.invoke(prompt);
    
    return c.json({ response });
  } catch (error) {
    console.error("Error in chat:", error);
    return c.json({ error: "Failed to process chat request" }, 500);
  }
});

// Start the server using Bun's built-in server instead of the Hono adapter
// This avoids the "Failed to find Response internal state key" error
const port = 3000;
console.log(`Server is running on port ${port}`);

// Use Bun's native HTTP server instead of Hono's adapter
Bun.serve({
  port: port,
  fetch: app.fetch,
});