import { useState } from 'react';
import { useCreateToken } from '../blockchain/hooks/useCreateToken';

const CreateTokenForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    maxSupply: '',
    price: '',
  });

  const { createToken, isPending, isSuccess, error, hash } = useCreateToken();

 

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validation based on field type
    if (name === 'name' && value.length > 50) {
      return; // Don't update if exceeds max length
    }
    if (name === 'symbol' && value.length > 10) {
      return; // Don't update if exceeds max length
    }
    if (name === 'description' && value.length > 500) {
      return; // Don't update if exceeds max length
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.name.trim() || formData.name.length > 50) {
      alert('Token name must be between 1 and 50 characters');
      return;
    }
    
    if (!formData.symbol.trim() || formData.symbol.length > 10) {
      alert('Token symbol must be between 1 and 10 characters');
      return;
    }
    
    if (!formData.description.trim() || formData.description.length > 500) {
      alert('Description must be between 1 and 500 characters');
      return;
    }
    
    const maxSupply = parseFloat(formData.maxSupply);
    const price = parseFloat(formData.price);
    
    if (isNaN(maxSupply) || maxSupply <= 0 || !Number.isInteger(maxSupply)) {
      alert('Max supply must be a positive integer');
      return;
    }
    
    if (isNaN(price) || price <= 0) {
      alert('Price must be a positive number');
      return;
    }
    
    createToken(formData.name.trim(), formData.symbol.trim(), formData.description.trim(), maxSupply, price);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Token</h2>
        <p className="text-gray-600">Fill in the details to tokenize your asset on the blockchain.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Token Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="e.g., My Gold Token"
              maxLength={50}
              required
            />
            {formData.name.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{formData.name.length}/50 characters</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Symbol</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="e.g., GLD"
              maxLength={10}
              required
            />
            {formData.symbol.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{formData.symbol.length}/10 characters</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
            placeholder="Describe your tokenized asset..."
            maxLength={500}
            required
          />
          {formData.description.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Supply</label>
            <input
              type="number"
              name="maxSupply"
              value={formData.maxSupply}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="e.g., 1000000"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (USDT)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="e.g., 10"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Token...
            </span>
          ) : (
            'Create Token'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateTokenForm;