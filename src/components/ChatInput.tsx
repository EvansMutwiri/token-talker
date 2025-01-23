import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full space-x-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message or enter $BTC..."
        className="flex-1"
      />
      <Button type="submit" className="bg-whatsapp-green hover:bg-whatsapp-green/90">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};