import { cn } from "@/lib/utils";
import { ExternalLink, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "./ui/button";

interface ChatMessageProps {
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

export const ChatMessage = ({ content, isBot, tokenData, marketInsight }: ChatMessageProps) => {
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
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <p className="text-sm">Price: {tokenData.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                {tokenData.change24h.startsWith("+") ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <p className="text-sm">24h Change: {tokenData.change24h}</p>
              </div>
              {tokenData.marketCap && (
                <p className="text-sm">Market Cap: {tokenData.marketCap}</p>
              )}
              {tokenData.volume24h && (
                <p className="text-sm">24h Volume: {tokenData.volume24h}</p>
              )}
              {tokenData.sentiment && (
                <p className="text-sm">
                  Market Sentiment:{" "}
                  <span
                    className={cn(
                      "font-medium",
                      tokenData.sentiment === "bullish" && "text-green-500",
                      tokenData.sentiment === "bearish" && "text-red-500"
                    )}
                  >
                    {tokenData.sentiment.charAt(0).toUpperCase() + tokenData.sentiment.slice(1)}
                  </span>
                </p>
              )}
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
        {marketInsight && (
          <div className="mt-2 space-y-2 border-t border-gray-200 pt-2">
            <h3 className="text-sm font-semibold">Market Overview</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-600">Total Market Cap</p>
                <p className="font-medium">{marketInsight.totalMarketCap}</p>
              </div>
              <div>
                <p className="text-gray-600">24h Volume</p>
                <p className="font-medium">{marketInsight.totalVolume24h}</p>
              </div>
              <div>
                <p className="text-gray-600">BTC Dominance</p>
                <p className="font-medium">{marketInsight.btcDominance}</p>
              </div>
              <div>
                <p className="text-gray-600">Top Gainer/Loser</p>
                <p className="font-medium text-green-500">↑ {marketInsight.topGainer}</p>
                <p className="font-medium text-red-500">↓ {marketInsight.topLoser}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};