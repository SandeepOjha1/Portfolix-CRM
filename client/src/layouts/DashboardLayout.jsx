import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const navigate = useNavigate();

  const handleGlobalSearch = (val) => {
    setGlobalSearch(val);
    if (val && window.location.pathname !== '/leads') {
      navigate(`/leads?search=${encodeURIComponent(val)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onSearch={handleGlobalSearch}
          searchValue={globalSearch}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ globalSearch, setGlobalSearch }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

