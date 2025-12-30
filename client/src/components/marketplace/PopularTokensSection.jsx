import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUtils } from '../../blockchain/hooks/useUtils';
import { usePaginatedTokens } from '../../blockchain/hooks/usePaginatedTokens';

const PopularTokensSection = ({ onTokenSelect }) => {
  const { tokens: currentTokens, total, isLoading, error } = usePaginatedTokens(0, 4); // Show first 6 tokens only
  const { convertToHumanReadable } = useUtils();

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Popular Tokens</h2>
        <Link
          to="/browse-tokens"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
        >
          Browse All →
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-2">Loading tokens...</h3>
          <p className="text-gray-500">Fetching the latest tokenized assets</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-2">Error loading tokens</h3>
          <p className="text-gray-500">Please try again later</p>
        </div>
      ) : currentTokens.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-2">No tokens available yet</h3>
          <p className="text-gray-500">Be the first to create and tokenize your assets!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 w-full">
          {currentTokens.map((token, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer w-full"
              onClick={() => onTokenSelect(token)}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none"></div>

              <div className="p-6 relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white truncate group-hover:text-purple-300 transition-colors duration-200">
                      {token.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">{token.symbol}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                      Available
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed min-h-[3rem]">
                  {token.description}
                </p>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Price</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        {Number(token.price) }
                      </span>
                      <span className="text-green-400 font-medium">USDT</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Available</span>
                    <span className="text-white font-semibold">
                      {convertToHumanReadable(token.maxSupply) - convertToHumanReadable(token.totalSupply)} / {convertToHumanReadable(token.maxSupply)}
                    </span>
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => onTokenSelect(token)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 group-hover:shadow-purple-500/20"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Purchase Token</span>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </section>
  );
};

export default PopularTokensSection;