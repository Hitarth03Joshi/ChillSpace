import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserManagement from './admin/UserManagement';
import PropertyManagement from './admin/PropertyManagement';
import RequestsPage from './admin/RequestsPage';
import AdminOverview from './admin/AdminOverview';
import '../styles/AdminComponents.scss';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-dashboard">
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-logo">
          <h2>{sidebarCollapsed ? 'CS' : 'ChillSpace'}</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas fa-${sidebarCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>
        <nav className="admin-nav">
          <ul>
            <li 
              className={isActive('/admin/dashboard') ? 'active' : ''} 
              onClick={() => navigate('/admin/dashboard')}
            >
              <i className="fas fa-tachometer-alt"></i>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </li>
            <li 
              className={isActive('/admin/users') ? 'active' : ''} 
              onClick={() => navigate('/admin/users')}
            >
              <i className="fas fa-users"></i>
              {!sidebarCollapsed && <span>User Management</span>}
            </li>
            <li 
              className={isActive('/admin/properties') ? 'active' : ''} 
              onClick={() => navigate('/admin/propertiesList')}
            >
              <i className="fas fa-home"></i>
              {!sidebarCollapsed && <span>Property Management</span>}
            </li>
            <li 
              className={isActive('/admin/requests') ? 'active' : ''} 
              onClick={() => navigate('/admin/requests')}
            >
              <i className="fas fa-clipboard-list"></i>
              {!sidebarCollapsed && <span>Request Management</span>}
            </li>
          </ul>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
      <div className={`admin-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Routes>
          <Route path="/dashboard" element={<AdminOverview />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/propertiesList" element={<PropertyManagement />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard; 