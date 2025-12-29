import { useState, useEffect } from 'react';
import { usePurchaseToken } from '../blockchain/hooks/usePurchaseToken';
import { useUSDTApproval } from '../blockchain/hooks/useUSDTApproval';
import { blockchainConfig } from '../blockchain/config';
import { formatUnits, parseUnits } from 'viem';

const PurchaseModal = ({ token, onClose }) => {
  const [amount, setAmount] = useState(1);
  const { purchaseToken, isPending, isSuccess } = usePurchaseToken();
  
  // Calculate total price in wei
  const totalPriceWei = token?.price ? (BigInt(amount) * BigInt(token.price)) : 0n;
  const { needsApproval, requestApproval, isApproving, isApprovalSuccess } = useUSDTApproval(totalPriceWei.toString());

  // Close modal on successful purchase
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || value === '0') {
      setAmount(1);
      return;
    }
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) {
      setAmount(1);
      return;
    }
    const maxAvailable = Number(token.maxSupply) - Number(token.totalSupply);
    if (numValue > maxAvailable) {
      setAmount(maxAvailable);
      return;
    }
    setAmount(numValue);
  };

  const handlePurchase = () => {
    // Validation
    if (amount < 1) {
      return;
    }
    const maxAvailable = Number(token.maxSupply) - Number(token.totalSupply);
    if (amount > maxAvailable) {
      return;
    }

    // Check if approval is needed
    if (needsApproval) {
      requestApproval(totalPriceWei.toString());
      return;
    }

    purchaseToken(token.tokenAddress, amount);
  };

  // Format price for display using proper precision
  const pricePerToken = token?.price ? formatUnits(BigInt(token.price), blockchainConfig.USDT_DECIMALS) : '0';
  const totalPrice = totalPriceWei > 0n ? formatUnits(totalPriceWei, blockchainConfig.USDT_DECIMALS) : '0';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        {/* Gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 pointer-events-none"></div>

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Purchase Token</h3>
            <p className="text-gray-400">Complete your purchase for <span className="text-purple-400 font-semibold">{token.name}</span></p>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Amount to Purchase</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min="1"
                max={Number(token.maxSupply) - Number(token.totalSupply)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg font-semibold"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">Qty:</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Available: {Number(token.maxSupply) - Number(token.totalSupply)} tokens
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-800/30 rounded-xl p-4 mb-6 border border-gray-700/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Price per token</span>
              <span className="text-white font-medium">
                {parseFloat(pricePerToken).toFixed(6)} USDT
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 text-sm">Quantity</span>
              <span className="text-white font-medium">{amount}</span>
            </div>
            <hr className="border-gray-700/50 mb-3" />
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {parseFloat(totalPrice).toFixed(6)} USDT
              </span>
            </div>
            {needsApproval && !isApprovalSuccess && (
              <div className="mt-3 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-xs text-yellow-400">
                Approval required before purchase
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 py-3 px-4 rounded-xl font-medium transition-all duration-200 border border-gray-600/50 hover:border-gray-500/50"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={isPending || isApproving}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
            >
              {isApproving ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Approving...</span>
                </div>
              ) : isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Purchasing...</span>
                </div>
              ) : needsApproval ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Approve USDT</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Complete Purchase</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;