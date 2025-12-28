import { blockchainConfig } from '../../blockchain/config';

const HeroSection = ({ tokens }) => {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
        Token Marketplace
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Discover and purchase unique tokenized assets in the decentralized marketplace
      </p>
      <div className="mt-8 flex justify-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live on Sepolia</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>{tokens?.length || 0} Assets Available</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;