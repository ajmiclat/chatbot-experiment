import { useState, useEffect, useRef } from 'react'
import './App.css'

// Types
type MessageType = {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

function App() {
  // State for messages
  const [messages, setMessages] = useState<MessageType[]>([
    { content: "Hi! I'm your AI assistant. How can I help you today?", isUser: false, timestamp: new Date() }
  ]);
  
  // State for current input
  const [input, setInput] = useState("");
  
  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  
  // State for context
  const [context, setContext] = useState("");
  
  // State for showing the context editor
  const [showContextEditor, setShowContextEditor] = useState(false);
  
  // Ref for scrolling to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch context on component mount
  useEffect(() => {
    fetchContext();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchContext = async () => {
    try {
      const response = await fetch("http://localhost:3000/context");
      const data = await response.json();
      setContext(data.context);
    } catch (error) {
      console.error("Error fetching context:", error);
    }
  };

  const updateContext = async () => {
    try {
      const response = await fetch("http://localhost:3000/context", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context }),
      });
      const data = await response.json();
      if (data.success) {
        setShowContextEditor(false);
        alert("Context updated successfully!");
      } else {
        alert("Failed to update context.");
      }
    } catch (error) {
      console.error("Error updating context:", error);
      alert("Error updating context. Check the console for details.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { content: input, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and set loading
    setInput("");
    setIsLoading(true);
    
    try {
      // Send message to backend
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [
        ...prev, 
        { content: data.response, isUser: false, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev, 
        { content: "Sorry, I encountered an error. Please try again later.", isUser: false, timestamp: new Date() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Chatbot</h1>
        <button 
          className="context-button"
          onClick={() => setShowContextEditor(!showContextEditor)}
        >
          {showContextEditor ? "Hide Context" : "Edit Context"}
        </button>
      </header>

      {showContextEditor && (
        <div className="context-editor">
          <h2>Edit Context</h2>
          <p className="context-hint">
            Update the knowledge base for your AI assistant. This information will be used to provide better responses.
          </p>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={10}
            placeholder="Enter additional context for the AI..."
          />
          <div className="context-buttons">
            <button onClick={updateContext}>Save Context</button>
            <button onClick={() => setShowContextEditor(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai-message">
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={3}
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
