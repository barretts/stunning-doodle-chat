import React from "react";
import { ChatMessage } from "../types";

interface ChatWindowProps {
  messages: ChatMessage[];
  typingUser: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages = [],
  typingUser,
}) => {
  return (
    <div className="w-full max-w-2xl bg-white p-4 rounded shadow mb-4 h-96 overflow-y-auto">
      {messages.map((msg, index) => (
        <div key={index} className="mb-2">
          <span className="font-bold">{msg.username}: </span>
          <span>{msg.message}</span>
          <span className="text-xs text-gray-500 ml-2">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
      {typingUser && (
        <div className="italic text-gray-500">{typingUser} is typing...</div>
      )}
    </div>
  );
};

export default ChatWindow;
