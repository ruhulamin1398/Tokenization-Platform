import { useState, useEffect } from 'react';
import { useUpdateTokenPrice } from"../blockchain/hooks/useUpdateTokenPrice";
import { useAccount } from '../blockchain/hooks/useAccount';
import { blockchainConfig } from '../blockchain/config';
import { useReadContract } from 'wagmi';
import { useUtils } from '../blockchain/hooks/useUtils';

const UpdatePricePage = () => {
  const [selectedToken, setSelectedToken] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [userTokens, setUserTokens] = useState([]);
  const { address } = useAccount();
  const { updateTokenPrice, isPending, isSuccess } = useUpdateTokenPrice();
  const { convertToHumanReadable } = useUtils();

  // Fetch user's tokens
  const { data: ownerTokensData } = useReadContract({
    address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
    abi: blockchainConfig.TOKEN_FACTORY_ABI,
    functionName: 'getOwnerTokens',
    args: [address],
    enabled: !!address,
  });

  // Fetch token details for each token
  const { data: tokenDetails } = useReadContract({
    address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
    abi: blockchainConfig.TOKEN_FACTORY_ABI,
    functionName: 'getTokensByAddresses',
    args: [ownerTokensData || []],
    enabled: !!ownerTokensData && ownerTokensData.length > 0,
  });

  // Reset form after successful update
  useEffect(() => {
    if (isSuccess) {
      setSelectedToken('');
      setNewPrice('');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (tokenDetails) {
      setUserTokens(tokenDetails);
    }
  }, [tokenDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedToken) {
      alert('Please select a token');
      return;
    }

    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price greater than 0');
      return;
    }

    updateTokenPrice(selectedToken, price);
  };

  const selectedTokenData = userTokens.find(token => token.tokenAddress === selectedToken);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Token Price</h1>
        <p className="text-gray-600">Update the price of your existing tokens</p>
      </div>

      {userTokens.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-2">No tokens found</h3>
          <p className="text-gray-500">You haven't created any tokens yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Token Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Token</label>
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              >
                <option value="">Choose a token...</option>
                {userTokens.map((token, index) => (
                  <option key={index} value={token.tokenAddress}>
                    {token.name} ({token.symbol}) - Current Price: {Number(token.price)} USDT
                  </option>
                ))}
              </select>
            </div>

            {/* Current Price Display */}
            {selectedTokenData && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Token Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-900">{selectedTokenData.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Symbol:</span>
                    <span className="ml-2 text-gray-900">{selectedTokenData.symbol}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Current Price:</span>
                    <span className="ml-2 text-green-600 font-semibold">{Number(selectedTokenData.price)} USDT</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Available:</span>
                    <span className="ml-2 text-gray-900">
                      {convertToHumanReadable(selectedTokenData.maxSupply) - convertToHumanReadable(selectedTokenData.totalSupply)} / {convertToHumanReadable(selectedTokenData.maxSupply)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* New Price Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Price (USDT)</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="e.g., 10.50"
                min="0"
                step="0.01"
                required
              />
              {newPrice && (
                <p className="text-xs text-gray-500 mt-1">
                  New price: {newPrice} USDT per token
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || !selectedToken || !newPrice}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Price...
                </span>
              ) : (
                'Update Token Price'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdatePricePage;