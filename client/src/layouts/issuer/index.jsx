import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Sidebar from './sidebar';
import SkeletonSidebar from './SkeletonSidebar';
import NotConnected from '../../components/NotConnected';
import { useAccount as useCustomAccount } from '../../blockchain/hooks/useAccount';

const IssuerLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isConnected } = useAccount();
  const { address, usdtBalance } = useCustomAccount();

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {isConnected ? (
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      ) : (
        <SkeletonSidebar collapsed={sidebarCollapsed} />
      )}

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
             
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            {address && (
              <div className="bg-gray-100 rounded-lg px-3 py-2 border border-gray-300">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 font-medium">USDT</span>
                  <span className="text-gray-900 font-semibold">{usdtBalance}</span>
                </div>
              </div>
            )}
            <ConnectButton showBalance={false} />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {isConnected ? <Outlet /> : <NotConnected />}
        </main>
      </div>
    </div>
  );
};

export default IssuerLayout;