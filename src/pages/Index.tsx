import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { useState } from "react";

interface Message {
  content: string;
  isBot: boolean;
  tokenData?: {
    symbol: string;
    price: string;
    change24h: string;
  };
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your crypto assistant. You can ask me about any cryptocurrency using its code (e.g., $BTC) or ask general questions about crypto!",
      isBot: true,
    },
  ]);

  const handleSendMessage = async (message: string) => {
    // Add user message
    setMessages((prev) => [...prev, { content: message, isBot: false }]);

    // Check for token query
    const tokenMatch = message.match(/\$([A-Za-z]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1].toUpperCase();
      // Simulate API call - In a real app, you'd fetch from a crypto API
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            content: `Here's the latest information for ${token}:`,
            isBot: true,
            tokenData: {
              symbol: token,
              price: "$45,000.00",
              change24h: "+2.5%",
            },
          },
        ]);
      }, 1000);
    } else {
      // Simple bot response for other messages
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            content: "I can help you check cryptocurrency prices. Try asking about a specific token using its code (e.g., $BTC, $ETH)!",
            isBot: true,
          },
        ]);
      }, 500);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <div className="bg-whatsapp-green p-4">
        <h1 className="text-lg font-bold text-white">Crypto Assistant</h1>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
      </div>
      
      <div className="border-t bg-white p-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Index;