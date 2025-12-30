import { useState, useEffect } from 'react';
import { useUpdateTokenPrice } from '../blockchain/hooks/useUpdateTokenPrice';
import { useUtils } from '../blockchain/hooks/useUtils';

const UpdatePriceModal = ({ token, onClose }) => {
  const [newPrice, setNewPrice] = useState(token?.price?.toString() || '');
  const { updateTokenPrice, isPending, isSuccess } = useUpdateTokenPrice();
  const { convertToHumanReadable } = useUtils();

  // Close modal on successful update
  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price greater than 0');
      return;
    }

    updateTokenPrice(token.tokenAddress, price);
  };

  if (!token) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Update Token Price</h3>
          <p className="text-gray-600">Update the price for <span className="text-blue-600 font-semibold">{token.name}</span></p>
        </div>

        {/* Current Price Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Token:</span>
              <span className="font-medium text-gray-900">{token.name} ({token.symbol})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Price:</span>
              <span className="font-bold text-green-600">{Number(token.price)} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available:</span>
              <span className="font-medium text-gray-900">
                {convertToHumanReadable(token.maxSupply) - convertToHumanReadable(token.totalSupply)} / {convertToHumanReadable(token.maxSupply)}
              </span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            {newPrice && newPrice !== token.price.toString() && (
              <p className="text-xs text-gray-500 mt-1">
                New price: {newPrice} USDT per token
                {parseFloat(newPrice) > Number(token.price) && (
                  <span className="text-green-600 ml-2">↑ Increase</span>
                )}
                {parseFloat(newPrice) < Number(token.price) && (
                  <span className="text-red-600 ml-2">↓ Decrease</span>
                )}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || newPrice === token.price.toString()}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update Price'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePriceModal;