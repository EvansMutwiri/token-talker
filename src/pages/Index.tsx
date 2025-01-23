import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { useState } from "react";
import { fetchTokenData, fetchMarketInsights } from "@/utils/cryptoApi";
import { useToast } from "@/hooks/use-toast";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const initializeChat = async () => {
    try {
      const marketInsight = await fetchMarketInsights();
      setMessages([
        {
          content: "Hello! I'm your crypto assistant. You can ask me about any cryptocurrency using its code (e.g., $BTC) or ask for market insights!",
          isBot: true,
          marketInsight,
        },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch market data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useState(() => {
    initializeChat();
  }, []);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { content: message, isBot: false }]);

    const tokenMatch = message.match(/\$([A-Za-z]+)/);
    try {
      if (tokenMatch) {
        const token = tokenMatch[1].toLowerCase();
        const tokenData = await fetchTokenData(token);
        setMessages((prev) => [
          ...prev,
          {
            content: `Here's the latest information for ${token.toUpperCase()}:`,
            isBot: true,
            tokenData,
          },
        ]);
      } else if (
        message.toLowerCase().includes("market") ||
        message.toLowerCase().includes("overview")
      ) {
        const marketInsight = await fetchMarketInsights();
        setMessages((prev) => [
          ...prev,
          {
            content: "Here's the current market overview:",
            isBot: true,
            marketInsight,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            content: "I can help you check cryptocurrency prices and market insights. Try asking about a specific token using its code (e.g., $BTC) or ask for a market overview!",
            isBot: true,
          },
        ]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again later.",
        variant: "destructive",
      });
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