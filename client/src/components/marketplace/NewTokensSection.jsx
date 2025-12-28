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
  const newTokens = tokens?.slice(0, 10) || [];

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
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 cursor-pointer h-full" onClick={() => onTokenSelect(token)}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{token.symbol.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">{token.name}</h4>
                    <p className="text-gray-400 text-sm">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-bold text-lg">
                    {Number(token.price) / 10**blockchainConfig.USDT_DECIMALS} USDT
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {Number(token.maxSupply) - Number(token.totalSupply)} available
                  </p>
                </div>
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