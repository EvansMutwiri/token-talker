interface DexScreenerResponse {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  header: string;
  description: string;
  links: {
    type: string;
    label: string;
    url: string;
  }[];
}

interface DexScreenerPairResponse {
  pairs: {
    priceUsd: string;
    priceChange24h: number;
    volume24h: number;
    fdv: number;
  }[];
}

export const fetchTokenData = async (symbol: string) => {
  try {
    const [profileResponse, pairResponse] = await Promise.all([
      fetch('https://api.dexscreener.com/token-profiles/latest/v1'),
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${symbol}`)
    ]);

    const profileData: DexScreenerResponse = await profileResponse.json();
    const pairData: DexScreenerPairResponse = await pairResponse.json();

    if (!pairData.pairs || pairData.pairs.length === 0) {
      throw new Error("Token not found");
    }

    const pair = pairData.pairs[0];
    const sentiment: "bullish" | "bearish" | "neutral" = 
      pair.priceChange24h > 2 ? "bullish" :
      pair.priceChange24h < -2 ? "bearish" :
      "neutral";

    return {
      symbol: symbol.toUpperCase(),
      price: `$${Number(pair.priceUsd).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change24h: `${pair.priceChange24h.toFixed(2)}%`,
      marketCap: `$${(pair.fdv / 1e9).toFixed(2)}B`,
      volume24h: `$${(pair.volume24h / 1e9).toFixed(2)}B`,
      sentiment,
    };
  } catch (error) {
    console.error("Error fetching token data:", error);
    throw error;
  }
};

export const fetchMarketInsights = async () => {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/trending');
    const data = await response.json();
    const pairs = data.pairs || [];

    // Sort pairs by price change to get top gainers and losers
    const sortedPairs = [...pairs].sort((a, b) => b.priceChange24h - a.priceChange24h);
    const topGainer = sortedPairs[0];
    const topLoser = sortedPairs[sortedPairs.length - 1];

    // Calculate total market cap and volume
    const totalMarketCap = pairs.reduce((sum, pair) => sum + (pair.fdv || 0), 0);
    const totalVolume = pairs.reduce((sum, pair) => sum + (pair.volume24h || 0), 0);

    // Calculate BTC dominance (assuming BTC is in the pairs)
    const btcPair = pairs.find(pair => pair.baseToken.symbol.toLowerCase() === 'wbtc');
    const btcDominance = btcPair ? (btcPair.fdv / totalMarketCap) * 100 : 0;

    return {
      totalMarketCap: `$${(totalMarketCap / 1e12).toFixed(2)}T`,
      totalVolume24h: `$${(totalVolume / 1e9).toFixed(2)}B`,
      btcDominance: `${btcDominance.toFixed(1)}%`,
      topGainer: `${topGainer?.baseToken?.symbol || 'N/A'} ${topGainer?.priceChange24h?.toFixed(1) || 0}%`,
      topLoser: `${topLoser?.baseToken?.symbol || 'N/A'} ${topLoser?.priceChange24h?.toFixed(1) || 0}%`,
    };
  } catch (error) {
    console.error("Error fetching market insights:", error);
    throw error;
  }
};