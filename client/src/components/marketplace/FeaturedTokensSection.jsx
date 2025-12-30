import { useState } from 'react';
import { blockchainConfig } from '../../blockchain/config';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useUtils } from '../../blockchain/hooks/useUtils';

const FeaturedTokensSection = ({ tokens, onTokenSelect }) => {
  const featuredTokens = tokens?.slice( -5) || [];
    const { convertToHumanReadable, convertToDecimalUnits } = useUtils();

  return (
    <section>
    

      <div className="relative">
        <Slider
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={5000}
          arrows={true}
          className="featured-slider"
          customPaging={(i) => (
            <div className="w-2 h-2 bg-gray-600 rounded-full hover:bg-purple-500 transition-colors duration-200"></div>
          )}
          dotsClass="slick-dots !bottom-4"
        >
          {featuredTokens.map((token, index) => (
            <div key={index} className="px-4">
              <div className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-pink-900/80 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-6 md:p-8 hover:border-purple-400/40 transition-all duration-500 min-h-[350px] max-h-[400px] overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

                {/* Floating geometric shapes */}
                <div className="absolute top-16 right-16 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce"></div>
                <div className="absolute top-24 right-24 w-2 h-2 bg-pink-400/40 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>

                <div className="relative z-10 h-full flex flex-col">
                  {/* Top section with visual and basic info */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      {/* Token badge */}
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-3 py-1 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-xs">{token.symbol.charAt(0)}</span>
                        </div>
                        <span className="text-purple-200 font-semibold text-xs">Featured</span>
                      </div>

                      {/* Title and symbol */}
                      <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-1">
                        {token.name}
                      </h3>
                      <p className="text-purple-300 font-medium text-lg">{token.symbol}</p>
                    </div>

                    {/* Token visual in top-right corner */}
                    <div className="relative ml-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-black text-2xl">{token.symbol.charAt(0)}</span>
                        </div>
                      </div>
                      {/* Small floating star */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <span className="text-white font-bold text-xs">★</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    {token.description}
                  </p>

                  {/* Bottom section with stats and CTA */}
                  <div className="flex items-end justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
                        <p className="text-gray-400 text-xs font-medium mb-1">Price</p>
                        <p className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {Number(token.price)  } USDT
                        </p>
                      </div>
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
                        <p className="text-gray-400 text-xs font-medium mb-1">Available</p>
                        <p className="text-lg font-bold text-white">
                          {convertToHumanReadable(token.maxSupply) - convertToHumanReadable(token.totalSupply)}
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => onTokenSelect(token)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                    >
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>Purchase</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FeaturedTokensSection;