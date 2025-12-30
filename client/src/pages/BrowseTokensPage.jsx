import { useState } from 'react';
import { usePaginatedTokens } from '../blockchain/hooks/usePaginatedTokens';
import { useUtils } from '../blockchain/hooks/useUtils';
import PurchaseModal from '../components/PurchaseModal';

const BrowseTokensPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedToken, setSelectedToken] = useState(null);
  const itemsPerPage = 12; // Show more tokens per page on dedicated page

  const { tokens: currentTokens, total, isLoading, error } = usePaginatedTokens(currentPage, itemsPerPage);
  const { convertToHumanReadable } = useUtils();

  // Calculate total pages
  const totalPages = Math.ceil(Number(total) / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Browse All Tokens
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and invest in tokenized assets from our comprehensive marketplace
          </p>
        </div>

        {/* Loading State */}
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
            {/* Modern Stats Bar */}
            <div className="bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 mb-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  {/* Total Tokens */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                        {Number(total)}
                      </div>
                      <div className="text-sm text-gray-400 font-medium">Total Tokens</div>
                    </div>
                  </div>

                  {/* Current Page */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                        {currentPage + 1}
                      </div>
                      <div className="text-sm text-gray-400 font-medium">Current Page</div>
                    </div>
                  </div>

                  {/* Total Pages */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center border border-green-500/30">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                        {totalPages}
                      </div>
                      <div className="text-sm text-gray-400 font-medium">Total Pages</div>
                    </div>
                  </div>
                </div>

                {/* Range Display */}
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-sm text-gray-400 font-medium">Showing</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, Number(total))} <span className="text-gray-400 text-lg">of</span> {Number(total)}
                  </div>
                </div>
              </div>
            </div>

            {/* Tokens Grid */}
            <div className="grid   grid-cols-3   gap-6 mb-8">
              {currentTokens.map((token, index) => (
                <div
                  key={index}
                  className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedToken(token)}
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
                            {Number(token.price)}
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
                      onClick={() => setSelectedToken(token)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i;
                        } else if (currentPage < 3) {
                          pageNum = i;
                        } else if (currentPage > totalPages - 3) {
                          pageNum = totalPages - 5 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                              currentPage === pageNum
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages - 1}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="text-sm text-gray-400">
                    Page {currentPage + 1} of {totalPages} ({Number(total)} total tokens)
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Purchase Modal */}
        {selectedToken && (
          <PurchaseModal
            token={selectedToken}
            onClose={() => setSelectedToken(null)}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseTokensPage;