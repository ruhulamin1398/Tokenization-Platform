import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Sidebar from './sidebar';
import NotConnected from '../../components/NotConnected';

const IssuerLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isConnected } = useAccount();

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
             
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <ConnectButton showBalance={false} />
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