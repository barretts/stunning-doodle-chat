import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onTyping }) => {
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSend} className="flex">
      <Input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          onTyping();
        }}
        className="flex-grow border p-2 rounded-l"
        placeholder="Type your message..."
      />
      <Button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r"
      >
        Send
      </Button>
    </form>
  );
};

export default ChatInput;
