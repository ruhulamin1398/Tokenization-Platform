import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import NotConnected from './NotConnected';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isConnected } = useAccount();

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gray-900 shadow-md transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 flex items-center justify-between">
          {!sidebarCollapsed && <h2 className="text-xl font-bold text-white">Issuer</h2>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white hover:bg-gray-700 p-2 rounded"
          >
            ☰
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#" className="text-white block">{sidebarCollapsed ? 'MT' : 'My Tokens'}</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#" className="text-white block">{sidebarCollapsed ? 'CT' : 'Create Token'}</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#" className="text-white block">{sidebarCollapsed ? 'A' : 'Analytics'}</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mr-4 p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              ☰
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <ConnectButton />
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {isConnected ? <Outlet /> : <NotConnected />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;