import { useState } from 'react';
import { useAllTokens } from '../blockchain/hooks/useAllTokens';
import PurchaseModal from './PurchaseModal';
import HeroSection from './marketplace/HeroSection';
import FeaturedTokensSection from './marketplace/FeaturedTokensSection';
import NewTokensSection from './marketplace/NewTokensSection';
import PopularTokensSection from './marketplace/PopularTokensSection';
import SkeletonCard from './SkeletonCard';

// Custom styles for slick arrows
const customStyles = `
  .slick-prev:before,
  .slick-next:before {
    color: #9ca3af !important;
  }
  .slick-prev:hover:before,
  .slick-next:hover:before {
    color: #a855f7 !important;
  }
  .slick-dots li button:before {
    color: #6b7280 !important;
  }
  .slick-dots li.slick-active button:before {
    color: #a855f7 !important;
  }
`;

const Marketplace = () => {
  const { tokens, isLoading, error } = useAllTokens();
  const [selectedToken, setSelectedToken] = useState(null);

  if (isLoading) {
    return (
      <div className="space-y-12">
        {/* Hero skeleton */}
        <div className="text-center">
          <div className="h-16 bg-gray-700 rounded-lg mx-auto mb-6 w-96 animate-pulse"></div>
          <div className="h-6 bg-gray-700 rounded mx-auto w-80 animate-pulse"></div>
        </div>

        {/* Featured section skeleton */}
        <div>
          <div className="h-8 bg-gray-700 rounded w-48 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>

        {/* New tokens skeleton */}
        <div>
          <div className="h-8 bg-gray-700 rounded w-40 mb-8 animate-pulse"></div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 animate-pulse">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded mb-1"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="h-6 bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular tokens skeleton */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
            <div className="h-5 bg-gray-700 rounded w-20 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
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
      <PopularTokensSection onTokenSelect={setSelectedToken} />

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