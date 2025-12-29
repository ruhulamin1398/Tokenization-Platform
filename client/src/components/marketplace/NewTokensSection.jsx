import { blockchainConfig } from '../../blockchain/config';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom styles for new tokens slider
const customStyles = `
  .new-tokens-slider .slick-track {
    display: flex;
    align-items: stretch;
  }
  .new-tokens-slider .slick-slide {
    height: auto;
  }
  .new-tokens-slider .slick-slide > div {
    height: 100%;
  }
`;

const NewTokensSection = ({ tokens, onTokenSelect }) => {
  const newTokens = (tokens?.slice(-10) || []).reverse();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <section >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">New Tokens</h2>
      </div>

      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 overflow-hidden">
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={3}
          slidesToScroll={1}
          arrows={true}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 640,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              }
            }
          ]}
          className="new-tokens-slider w-full"
        >
          {newTokens.map((token, index) => (
            <div key={index} className="px-2">
              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-500 cursor-pointer h-full overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Token Icon & Basic Info */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center  ">
                        <span className="text-white font-black text-xl">{token.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{token.name}</h3>
                        <p className="text-cyan-400 font-semibold text-sm">{token.symbol}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Live</span>
                    </div>
                  </div>

                  {/* Price Display - Centered */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-baseline space-x-2 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-xl px-6 py-3 border border-cyan-400/20">
                      <span className="text-xl font-black text-white">
                        {Number(token.price) / 10**blockchainConfig.USDT_DECIMALS}
                      </span>
                      <span className="text-cyan-400 font-bold text-xl">USDT</span>
                    </div> 
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="text-gray-400 text-sm">Available</p>
                      <p className="text-white font-semibold">
                        {Number(token.maxSupply) - Number(token.totalSupply)} tokens
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(100, ((Number(token.maxSupply) - Number(token.totalSupply)) / Number(token.maxSupply)) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle border animation */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -m-px"></div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
    </>
  );
};

export default NewTokensSection;