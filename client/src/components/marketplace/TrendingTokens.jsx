import { useAllTokens } from '../../blockchain/hooks/useAllTokens';
import { blockchainConfig } from '../../blockchain/config';

const TrendingTokens = () => {
  const { tokens, isLoading } = useAllTokens();

  if (isLoading || !tokens) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Get top 8 tokens by price for trending
  const trendingTokens = tokens
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 8);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Trending Tokens</h3>
      {trendingTokens.map((token, index) => (
        <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-purple-500/30 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {token.symbol.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{token.symbol}</p>
                <p className="text-green-400 font-bold text-sm">
                  {Number(token.price) } USDT
                </p>
              </div>
            </div>
            <div className="w-16 h-6 ml-4">
              <svg viewBox="0 0 64 24" className="w-full h-full">
                <defs>
                  <linearGradient id={`trending-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={Math.random() > 0.5 ? "#10B981" : "#EF4444"} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={Math.random() > 0.5 ? "#10B981" : "#EF4444"} stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                {/* Generate simple trend line */}
                <path
                  d={`M 0,${12 + (Math.random() - 0.5) * 8} L 8,${12 + (Math.random() - 0.5) * 8} L 16,${12 + (Math.random() - 0.5) * 8} L 24,${12 + (Math.random() - 0.5) * 8} L 32,${12 + (Math.random() - 0.5) * 8} L 40,${12 + (Math.random() - 0.5) * 8} L 48,${12 + (Math.random() - 0.5) * 8} L 56,${12 + (Math.random() - 0.5) * 8} L 64,${12 + (Math.random() - 0.5) * 8}`}
                  stroke={Math.random() > 0.5 ? "#10B981" : "#EF4444"}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Fill area under the line */}
                <path
                  d={`M 0,24 L 0,${12 + (Math.random() - 0.5) * 8} L 8,${12 + (Math.random() - 0.5) * 8} L 16,${12 + (Math.random() - 0.5) * 8} L 24,${12 + (Math.random() - 0.5) * 8} L 32,${12 + (Math.random() - 0.5) * 8} L 40,${12 + (Math.random() - 0.5) * 8} L 48,${12 + (Math.random() - 0.5) * 8} L 56,${12 + (Math.random() - 0.5) * 8} L 64,${12 + (Math.random() - 0.5) * 8} L 64,24 Z`}
                  fill={`url(#trending-gradient-${index})`}
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingTokens;