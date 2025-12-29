import { Outlet } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import TrendingTokens from '../../components/marketplace/TrendingTokens';
import { useAccount } from '../../blockchain/hooks/useAccount';

const UserLayout = () => {
  const { address, usdtBalance } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-3">
                <div className="w-10 h-10 bg-gradient-to-r mx-2 from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg ">T</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Token Marketplace
                </h1>
              </div>
              <a
                href="/issuer"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-white/10"
              >
                Deploy Token
              </a>   <a
                href="/issuer"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-white/10"
              >
                Dashboard
              </a>   <a
                href="/faucet"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-white/10"
              >
                Faucet
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {address && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 font-medium">USDT</span>
                      <span className="text-white font-semibold">{usdtBalance}</span>
                    </div>
                  </div>
              )}
              <ConnectButton showBalance={false} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 w-7/9">
            <Outlet />
          </div>

          {/* Right Sidebar */}
          <div className="w-2/9 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <TrendingTokens />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;