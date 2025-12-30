import { useState, useEffect, useCallback } from 'react';
import { useAccount } from '../blockchain/hooks/useAccount';
import { useUserHoldings } from '../blockchain/hooks/useUserHoldings';
import { useUtils } from '../blockchain/hooks/useUtils';
import { useTransferToken } from '../blockchain/hooks/useTransferToken';
import SkeletonCard from '../components/SkeletonCard';

const UserDashboard = () => {
  const { address, usdtBalance } = useAccount();
  const { userHoldings, totalValue, isLoading } = useUserHoldings();
  const { convertToHumanReadable } = useUtils();

  const handleTransferSuccess = useCallback(() => {
    // Close modal on successful transfer
    setTransferModalOpen(false);
    setSelectedToken(null);
  }, []);

  const {
    transferAmount,
    setTransferAmount,
    recipientAddress,
    setRecipientAddress,
    transferToken,
    isTransferring,
    isConfirming
  } = useTransferToken(handleTransferSuccess);

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-300 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">My Portfolio</h1>
          <p className="text-gray-400 text-lg">Track your tokenized assets and investments</p>
        </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Total Value Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Purchase</p>
              <p className="text-3xl font-bold">${totalValue}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-300 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +2.5%
            </span>
            <span className="text-blue-200 ml-2">vs last month</span>
          </div>
        </div>

        {/* USDT Balance Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm font-medium">USDT Balance</p>
              <p className="text-3xl font-bold">{usdtBalance} USDT</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-green-200">
            Available for purchases
          </div>
        </div>

        {/* Tokens Owned Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm font-medium">Tokens Owned</p>
              <p className="text-3xl font-bold">{userHoldings.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-purple-200">
            Unique token types
          </div>
        </div>
      </div>

      {/* Token Holdings Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold text-white">My Token Holdings</h2>
          <p className="text-gray-400 mt-1">Assets you own in your portfolio</p>
        </div>

        {userHoldings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No tokens owned yet</h3>
            <p className="text-gray-500 mb-6">Start building your portfolio by purchasing tokens from the marketplace.</p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Browse Marketplace
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/30 divide-y divide-gray-700/50">
                {userHoldings.map((token, index) => (
                  <tr key={index} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{token.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{token.name}</div>
                          <div className="text-sm text-gray-400">{token.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-200 rounded-full">
                        {token.symbol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <span className="font-medium">{token.formattedBalance || '0.00'}</span>
                      <span className="text-gray-400 ml-1">tokens</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <span className="font-medium">${token.formattedValue || '0.00'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <span className="font-medium">{Number(token.price)} USDT</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedToken(token);
                          setTransferModalOpen(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 px-3 py-1 bg-blue-900/20 rounded-lg transition duration-200"
                      >
                        Transfer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Token Purchase</p>
                <p className="text-sm text-gray-400">Purchased 10.00 GLD tokens</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">$100.00</p>
              <p className="text-sm text-gray-400">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">USDT Deposit</p>
                <p className="text-sm text-gray-400">Received 500.00 USDT</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-400">+$500.00</p>
              <p className="text-sm text-gray-400">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {transferModalOpen && selectedToken && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Transfer {selectedToken.name}</h3>
                <button
                  onClick={() => {
                    setTransferModalOpen(false);
                    setSelectedToken(null);
                  }}
                  className="text-gray-400 hover:text-white transition duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-400">
                Available: {selectedToken?.formattedBalance || '0.00'} {selectedToken?.symbol}
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setTransferModalOpen(false);
                    setSelectedToken(null);
                    setRecipientAddress('');
                    setTransferAmount('');
                  }}
                  disabled={isTransferring}
                  className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Transfer button clicked');
                    console.log('selectedToken:', selectedToken);
                    console.log('transferAmount:', transferAmount);
                    console.log('recipientAddress:', recipientAddress);

                    if (selectedToken && selectedToken.tokenAddress) {
                      console.log('Transferring token:', selectedToken);
                      const amount = parseFloat(transferAmount);
                      const available = parseFloat(selectedToken.formattedBalance || '0');

                      if (amount > available) {
                        alert('Transfer amount exceeds available balance');
                        return;
                      }

                      transferToken(selectedToken.tokenAddress, transferAmount, recipientAddress);
                    } else {
                      console.error('Selected token or tokenAddress is missing:', selectedToken);
                      alert('Token address is missing. Please try again.');
                    }
                  }}
                  disabled={isTransferring || !recipientAddress || !transferAmount}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {isTransferring ? (isConfirming ? 'Confirming...' : 'Transferring...') : 'Transfer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default UserDashboard;