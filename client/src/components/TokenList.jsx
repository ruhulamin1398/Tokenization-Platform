import { useOwnerTokens } from '../blockchain/hooks/useOwnerTokens';
import { blockchainConfig } from '../blockchain/config';
import SkeletonIssuerCard from './SkeletonIssuerCard';

const TokenList = () => {
  const { tokens, isLoading, error } = useOwnerTokens();

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-80 animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonIssuerCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Tokens</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokens || tokens.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Tokens Created</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first tokenized asset.</p>
        <div className="mt-6">
          <a
            href="/issuer/create-token"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Create Token
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-gray-900">My Created Tokens</h3>
        <p className="mt-2 text-gray-600">Manage and monitor tokenized assets.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tokens.map((token, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{token.name}</h4>
                <p className="text-sm text-gray-500 font-medium">{token.symbol}</p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
            <p className="text-gray-600 mt-3 text-sm leading-relaxed line-clamp-2 min-h-[3rem]">
              {token.description}
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Contract Address</span>
                <a
                  href={`${blockchainConfig.EXPLORER_ADDRESS}${token.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-blue-600 hover:text-blue-800 bg-gray-100 px-2 py-1 rounded break-all max-w-32 hover:bg-gray-200 transition duration-200"
                >
                  {token.tokenAddress.slice(0, 6)}...{token.tokenAddress.slice(-5)}
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Max Supply</span>
                <span className="text-sm font-semibold text-gray-900">{token.maxSupply.toString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Sold</span>
                <span className="text-sm font-semibold text-gray-900">{token.totalSupply.toString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Price</span>
                <span className="text-sm font-semibold text-gray-900">{token.price.toString()} USDT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Created</span>
                <span className="text-sm text-gray-900">{new Date(Number(token.createdAt) * 1000).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;