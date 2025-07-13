import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNav from '../components/navigation/DashboardNav';
import DashboardSidebar from '../components/navigation/DashboardSidebar';
import './DashboardLayout.css';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      <DashboardNav toggleSidebar={toggleSidebar} />
      <div className="dashboard-container">
        <DashboardSidebar isOpen={sidebarOpen} />
        <main className={`dashboard-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;