# AI Chatbot with Context Support

This project implements an AI chatbot with a React frontend and Bun+Hono backend. The chatbot can use additional context that you provide through a text file.

## Features

- React-based chat interface
- Bun and Hono.js backend
- Context management through editable text file
- Integration with free LLM (Ollama)

## Prerequisites

- [Bun](https://bun.sh/) installed
- [Ollama](https://ollama.ai/) installed with llama3 model
  - Install Ollama from https://ollama.ai/
  - Run: `ollama pull llama3` to download the model

## Project Structure

```
chatbot-2/
├── backend/           # Hono.js API server
│   ├── context.txt    # Editable context file
│   ├── index.ts       # Server implementation
│   └── ...
├── frontend/          # React frontend
│   ├── src/           # React components and styles
│   └── ...
└── README.md
```

## Setup and Running

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the backend server:
   ```bash
   bun run index.ts
   ```
   The server will run on http://localhost:3000

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```
   The React app will be available at http://localhost:5173

## Usage

1. Make sure Ollama is running with the llama3 model available
2. Start both the backend and frontend servers
3. Open the frontend URL in your browser
4. Chat with the AI using the message input
5. Click "Edit Context" to modify the additional context information

## Updating Context

You can update the context in two ways:
1. Through the UI by clicking "Edit Context" button
2. By directly editing the `backend/context.txt` file

The context will be included in each prompt to the AI, allowing you to provide custom knowledge or instructions.

## Customization

- Change the LLM model by modifying the `model` parameter in `backend/index.ts`
- Adjust the system prompt in the chat endpoint in `backend/index.ts`
- Modify the UI styling in `frontend/src/App.css`