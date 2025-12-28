import { useState } from 'react';
import { usePurchaseToken } from '../blockchain/hooks/usePurchaseToken';
import { blockchainConfig } from '../blockchain/config';

const PurchaseModal = ({ token, onClose }) => {
  const [amount, setAmount] = useState(1);
  const { purchaseToken, isPending } = usePurchaseToken();

  const handlePurchase = () => {
    purchaseToken(token.tokenAddress, amount);
    onClose();
  };

  const totalPrice = (amount * Number(token.price)) / 10**blockchainConfig.USDT_DECIMALS;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Purchase {token.name}</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
            min="1"
            max={Number(token.maxSupply) - Number(token.totalSupply)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Price per token: {Number(token.price) / 10**blockchainConfig.USDT_DECIMALS} USDT</p>
          <p className="text-lg font-semibold">Total: {totalPrice} USDT</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={isPending}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isPending ? 'Purchasing...' : 'Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;