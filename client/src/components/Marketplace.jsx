import { useState } from 'react';
import { useAllTokens } from '../blockchain/hooks/useAllTokens';
import PurchaseModal from './PurchaseModal';
import HeroSection from './marketplace/HeroSection';
import FeaturedTokensSection from './marketplace/FeaturedTokensSection';
import NewTokensSection from './marketplace/NewTokensSection';
import PopularTokensSection from './marketplace/PopularTokensSection';
import './Marketplace.css';

const Marketplace = () => {
  const { tokens, isLoading, error } = useAllTokens();
  const [selectedToken, setSelectedToken] = useState(null);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-20 animate-pulse"></div>
        </div>
        <span className="mt-6 text-xl text-gray-300 font-medium">Loading marketplace...</span>
        <div className="mt-2 text-sm text-gray-500">Discovering amazing tokenized assets</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-red-900/20 border border-red-500/30 rounded-2xl backdrop-blur-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-400 font-semibold text-lg mb-2">Error loading marketplace</p>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* <HeroSection tokens={tokens} /> */}
      
      <FeaturedTokensSection tokens={tokens} onTokenSelect={setSelectedToken} />
     
      <NewTokensSection tokens={tokens} onTokenSelect={setSelectedToken} />
      <PopularTokensSection tokens={tokens} onTokenSelect={setSelectedToken} />

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