import React from 'react';

const SkeletonSidebar = ({ collapsed }) => {
  return (
    <aside className={`bg-gray-900 shadow-md ${collapsed ? 'w-16' : 'w-64'} animate-pulse`}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <div className="h-6 bg-gray-700 rounded w-16"></div>}
        <div className="w-9 h-9 bg-gray-700 rounded"></div>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2 px-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="py-3">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-gray-700 rounded mr-3 flex-shrink-0"></div>
                {!collapsed && <div className="h-4 bg-gray-700 rounded flex-1"></div>}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SkeletonSidebar;