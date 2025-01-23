import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
  tokenData?: {
    symbol: string;
    price: string;
    change24h: string;
  };
}

export const ChatMessage = ({ content, isBot, tokenData }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-message-appear",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isBot ? "bg-whatsapp-light" : "bg-whatsapp-sent"
        )}
      >
        <p className="text-sm">{content}</p>
        {tokenData && (
          <div className="mt-2 space-y-2 border-t border-gray-200 pt-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold">{tokenData.symbol}</p>
              <p className="text-sm">Price: {tokenData.price}</p>
              <p className="text-sm">24h Change: {tokenData.change24h}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="default"
                className="bg-whatsapp-green hover:bg-whatsapp-green/90"
                onClick={() =>
                  window.open(
                    `https://app.uniswap.org/#/swap?outputCurrency=${tokenData.symbol}`,
                    "_blank"
                  )
                }
              >
                Buy
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://dexscreener.com/ethereum/${tokenData.symbol}`,
                    "_blank"
                  )
                }
              >
                View Details <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};