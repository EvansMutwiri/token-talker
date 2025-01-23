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
    marketCap?: string;
    volume24h?: string;
    sentiment?: "bullish" | "bearish" | "neutral";
  };
  marketInsight?: {
    totalMarketCap: string;
    totalVolume24h: string;
    btcDominance: string;
    topGainer: string;
    topLoser: string;
  };
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your crypto assistant. You can ask me about any cryptocurrency using its code (e.g., $BTC) or ask for market insights!",
      isBot: true,
      marketInsight: {
        totalMarketCap: "$2.1T",
        totalVolume24h: "$98.5B",
        btcDominance: "48.2%",
        topGainer: "SOL +12.5%",
        topLoser: "DOGE -8.2%",
      },
    },
  ]);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { content: message, isBot: false }]);

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
              marketCap: "$850B",
              volume24h: "$24.5B",
              sentiment: "bullish",
            },
          },
        ]);
      }, 1000);
    } else if (message.toLowerCase().includes("market") || message.toLowerCase().includes("overview")) {
      // Provide market insights for general market-related queries
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            content: "Here's the current market overview:",
            isBot: true,
            marketInsight: {
              totalMarketCap: "$2.1T",
              totalVolume24h: "$98.5B",
              btcDominance: "48.2%",
              topGainer: "SOL +12.5%",
              topLoser: "DOGE -8.2%",
            },
          },
        ]);
      }, 500);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            content: "I can help you check cryptocurrency prices and market insights. Try asking about a specific token using its code (e.g., $BTC) or ask for a market overview!",
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