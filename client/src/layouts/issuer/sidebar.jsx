import { useState } from 'react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={`bg-gray-900 shadow-md transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h2 className="text-xl font-bold text-white">Issuer</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-gray-700 p-2 rounded"
        >
          ☰
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          <li className="px-4 py-2 hover:bg-gray-700">
            <a href="#" className="text-white block">{collapsed ? 'MT' : 'My Tokens'}</a>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <a href="#" className="text-white block">{collapsed ? 'CT' : 'Create Token'}</a>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <a href="#" className="text-white block">{collapsed ? 'A' : 'Analytics'}</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;