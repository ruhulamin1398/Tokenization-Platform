import { useState } from 'react';
import { useAllTokens } from '../blockchain/hooks/useAllTokens';
import { blockchainConfig } from '../blockchain/config';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PurchaseModal from './PurchaseModal';

const Marketplace = () => {
  const { tokens, isLoading, error } = useAllTokens();
  const [selectedToken, setSelectedToken] = useState(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading marketplace...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading marketplace: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Token Marketplace</h1>
        <p className="text-xl text-gray-600">Discover and purchase tokenized assets</p>
      </div>

        {(!tokens || tokens.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tokens available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tokens.map((token, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{token.name}</h3>
                      <p className="text-sm text-gray-500">{token.symbol}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Available
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{token.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-semibold">{Number(token.price) / 10**blockchainConfig.USDT_DECIMALS} USDT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available:</span>
                      <span className="font-semibold">{Number(token.maxSupply) - Number(token.totalSupply)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedToken(token)}
                    className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition duration-200"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      {selectedToken && (
        <PurchaseModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
};

export default Marketplace;