import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden animate-pulse">
      <div className="p-6">
        {/* Header skeleton */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-700 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="w-8 h-6 bg-gray-700 rounded-full"></div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>

        {/* Stats skeleton */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-12 bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;