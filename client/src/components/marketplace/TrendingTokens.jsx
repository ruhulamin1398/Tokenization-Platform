import { useAllTokens } from '../../blockchain/hooks/useAllTokens';
import { blockchainConfig } from '../../blockchain/config';

const TrendingTokens = () => {
  const { tokens, isLoading } = useAllTokens();

  if (isLoading || !tokens) return null;

  // Get top 8 tokens by price for trending
  const trendingTokens = tokens
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 8);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Trending Tokens</h3>
      {trendingTokens.map((token, index) => (
        <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-purple-500/30 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {token.symbol.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{token.name}</p>
              <p className="text-gray-400 text-xs">{token.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-bold text-sm">
                {Number(token.price) / 10**blockchainConfig.USDT_DECIMALS} USDT
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingTokens;