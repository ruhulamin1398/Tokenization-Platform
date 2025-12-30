import { useState, useEffect } from 'react';
import { usePurchaseToken } from '../blockchain/hooks/usePurchaseToken';
import { useAccount } from '../blockchain/hooks/useAccount';
import { blockchainConfig } from '../blockchain/config';
import { toast } from 'react-toastify';
import { useUtils } from '../blockchain/hooks/useUtils';

const PurchaseModal = ({ token, onClose }) => {
  const { usdtBalance, rawUsdtBalance } = useAccount();
  const { convertToHumanReadable, convertToDecimalUnits } = useUtils();

  const {
    purchaseToken,
    needsApproval,
    allowance,
    purchaseTokenAmount,
    setPurchaseTokenAmount,
    requiredUSDT,
    setRequiredUSDT,
    isPending,
    isSuccess,
    quantity, 
    setQuantity
  } = usePurchaseToken();

  // Update purchase amounts when quantity changes
  useEffect(() => {
    const tokenAmountInDecimals = convertToDecimalUnits(quantity.toString());
    const requiredUSDTAmount = BigInt(tokenAmountInDecimals) * BigInt(token.price);

    setPurchaseTokenAmount(tokenAmountInDecimals);
    setRequiredUSDT(requiredUSDTAmount.toString());
    console.log({tokenAmountInDecimals, requiredUSDTAmount})
  }, [quantity, token.price, setPurchaseTokenAmount, setRequiredUSDT, convertToDecimalUnits]);

  // Close modal on successful purchase
  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  // Handle quantity increase
  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    const tokenAmountInDecimals = convertToDecimalUnits(newQuantity.toString());
    const requiredUSDTAmount = BigInt(tokenAmountInDecimals) * BigInt(token.price);

    // Check if new required USDT exceeds balance
    if (requiredUSDTAmount > BigInt(rawUsdtBalance || 0)) {
      toast.error('Insufficient USDT balance for this quantity');
      return;
    }
    if(token?.maxSupply-token?.totalSupply < convertToDecimalUnits(newQuantity)){
      toast.error("No token available to purchase this quantity");
      return ;
    }

    setQuantity(newQuantity);
  };

  // Handle quantity decrease
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle purchase
  const handlePurchase = () => {
    if (!token?.tokenAddress) { 
      toast.error('Invalid token');
      return;
    }

    purchaseToken(token.tokenAddress, quantity);
  };

  // Calculate display values 
  const totalPriceDisplay = convertToHumanReadable(requiredUSDT || '0');
  const allowanceDisplay = convertToHumanReadable(allowance || '0');

  // Check if balance is sufficient
  const exceedsBalance = BigInt(requiredUSDT || '0') > BigInt(rawUsdtBalance || '0');

  // Check if approval is needed
  const needsApprovalDisplay = BigInt(allowance || '0') < BigInt(requiredUSDT || '0');

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

          {/* Quantity Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Amount to Purchase</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="w-12 h-12 bg-gray-700/50 hover:bg-gray-600/50 disabled:bg-gray-800/50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white font-bold transition-all duration-200 border border-gray-600/50"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value) || 1;
                    if (newQuantity >= 1) {
                      const tokenAmountInDecimals = convertToDecimalUnits(newQuantity.toString());
                      const requiredUSDTAmount = BigInt(tokenAmountInDecimals) * BigInt(token.price);

                      // Check balance before setting
                      if (requiredUSDTAmount <= BigInt(rawUsdtBalance || 0)) {
                        setQuantity(newQuantity);
                      } else {
                        toast.error('Insufficient USDT balance for this quantity');
                      }
                    }
                  }}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg font-semibold"
                />
              </div>
              <button
                onClick={handleIncrease}
                className="w-12 h-12 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-200 border border-gray-600/50"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Available:    {convertToHumanReadable(token.maxSupply) - convertToHumanReadable(token.totalSupply)} / {convertToHumanReadable(token.maxSupply)} tokens
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-800/30 rounded-xl p-4 mb-6 border border-gray-700/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Price per token</span>
              <span className="text-white font-medium">
                {token.price} USDT
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 text-sm">Quantity</span>
              <span className="text-white font-medium">{quantity}</span>
            </div>
            <hr className="border-gray-700/50 mb-3" />
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {totalPriceDisplay} USDT
              </span>
            </div>

            {exceedsBalance && (
              <div className="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400">
                Insufficient USDT balance (Available: {usdtBalance} USDT)
              </div>
            )}

            {needsApprovalDisplay && !exceedsBalance && (
              <div className="mt-3 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-xs text-yellow-400">
                USDT approval required before purchase
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
              disabled={isPending || exceedsBalance}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
            >
              {isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{needsApproval ? 'Approving...' : 'Purchasing...'}</span>
                </div>
              ) : exceedsBalance ? (
                <div className="flex items-center justify-center space-x-2">
                  
                  <span>Insufficient Balance</span>
                </div>
              ) : needsApproval ? (
                <div className="flex items-center justify-center space-x-2">
                  
                  <span>Approve & Purchase</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                
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