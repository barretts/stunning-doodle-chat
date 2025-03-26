import React, { useState, useEffect, useRef } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { ChatMessage } from "./types";

interface ChatAppProps {
  username: string;
  token?: string;
}

const ChatApp: React.FC<ChatAppProps> = ({ username, token }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const typingTimeout = useRef<number | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000/ws?token=" + token);

    ws.current.onopen = () => console.log("Connected to WebSocket server");

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.typing) {
          setTypingUser(data.username);
          if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
          typingTimeout.current = window.setTimeout(() => {
            setTypingUser(null);
          }, 2000);
        } else {
          setMessages((prev) => [...prev, data]);
        }
      } catch (err) {
        console.error("Invalid JSON data received from the server.");
      }
    };

    ws.current.onerror = (err) => {
      localStorage.removeItem("token");
      console.error("WebSocket error: ", err);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    const payload = {
      token,
      username,
      typing: false,
      content,
      timestamp: new Date().toISOString(),
    };
    ws.current.send(JSON.stringify(payload));
  };

  const handleTyping = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    const payload = {
      token,
      username,
      typing: true,
      content: "You are typing...",
      timestamp: new Date().toISOString(),
    };
    ws.current.send(JSON.stringify(payload));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Chat App</h1>
      <ChatWindow
        messages={messages}
        typingUser={typingUser !== username ? typingUser : null}
      />
      <ChatInput onSend={handleSendMessage} onTyping={handleTyping} />
    </div>
  );
};

export default ChatApp;
