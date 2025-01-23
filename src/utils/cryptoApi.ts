interface CoinGeckoResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
    usd_24h_vol: number;
  };
}

interface GlobalDataResponse {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number };
  };
}

export const fetchTokenData = async (symbol: string) => {
  try {
    const normalizedSymbol = symbol.toLowerCase();
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${normalizedSymbol}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`
    );
    const data: CoinGeckoResponse = await response.json();

    if (!data[normalizedSymbol]) {
      throw new Error("Token not found");
    }

    const tokenData = data[normalizedSymbol];
    const sentiment: "bullish" | "bearish" | "neutral" = 
      tokenData.usd_24h_change > 2 ? "bullish" :
      tokenData.usd_24h_change < -2 ? "bearish" :
      "neutral";

    return {
      symbol: symbol.toUpperCase(),
      price: `$${tokenData.usd.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change24h: `${tokenData.usd_24h_change.toFixed(2)}%`,
      marketCap: `$${(tokenData.usd_market_cap / 1e9).toFixed(2)}B`,
      volume24h: `$${(tokenData.usd_24h_vol / 1e9).toFixed(2)}B`,
      sentiment,
    };
  } catch (error) {
    console.error("Error fetching token data:", error);
    throw error;
  }
};

export const fetchMarketInsights = async () => {
  try {
    const [globalData, topTokens] = await Promise.all([
      fetch("https://api.coingecko.com/api/v3/global").then((res) =>
        res.json()
      ) as Promise<GlobalDataResponse>,
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_change_percentage_24h&per_page=100&sparkline=false"
      ).then((res) => res.json()),
    ]);

    const topGainer = topTokens[0];
    const topLoser = topTokens[topTokens.length - 1];

    return {
      totalMarketCap: `$${(
        globalData.data.total_market_cap.usd / 1e12
      ).toFixed(2)}T`,
      totalVolume24h: `$${(
        globalData.data.total_volume.usd / 1e9
      ).toFixed(2)}B`,
      btcDominance: `${globalData.data.market_cap_percentage.btc.toFixed(1)}%`,
      topGainer: `${topGainer.symbol.toUpperCase()} ${topGainer.price_change_percentage_24h.toFixed(
        1
      )}%`,
      topLoser: `${topLoser.symbol.toUpperCase()} ${topLoser.price_change_percentage_24h.toFixed(
        1
      )}%`,
    };
  } catch (error) {
    console.error("Error fetching market insights:", error);
    throw error;
  }
};