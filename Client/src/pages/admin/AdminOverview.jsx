import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminComponents.scss';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingRequests: 0,
    activeListings: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch users
      const usersResponse = await axios.get('http://localhost:3001/User/get');
      const users = Array.isArray(usersResponse.data.data) ? usersResponse.data.data : [];
      
      // Fetch properties
      const propertiesResponse = await axios.get('http://localhost:3001/properties/getalllisting');
      const properties = Array.isArray(propertiesResponse.data) ? propertiesResponse.data : [];
      
      // Fetch requests
      const requestsResponse = await axios.get('http://localhost:3001/requests/all');
      const requests = Array.isArray(requestsResponse.data) ? requestsResponse.data : [];
      
      // Calculate stats
      const totalUsers = users.length;
      const totalProperties = properties.length;
      const pendingRequests = requests.filter(req => req.status === 'pending').length;
      const activeListings = properties.filter(prop => prop.status === 'active').length;
      
      // Set stats
      setStats({
        totalUsers,
        totalProperties,
        pendingRequests,
        activeListings
      });
      
      // Get recent activity (combine and sort recent actions)
      const recentActivities = [
        ...users.slice(0, 5).map(user => ({
          type: 'user',
          action: 'registered',
          item: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
          timestamp: new Date(user.createdAt || new Date()).toLocaleString()
        })),
        ...properties.slice(0, 5).map(property => ({
          type: 'property',
          action: 'added',
          item: property.title || 'Property',
          timestamp: new Date(property.createdAt || new Date()).toLocaleString()
        })),
        ...requests.slice(0, 5).map(request => ({
          type: 'request',
          action: request.status || 'pending',
          item: `Request for ${request.propertyId?.title || 'property'}`,
          timestamp: new Date(request.createdAt || new Date()).toLocaleString()
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
      
      setRecentActivity(recentActivities);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  };

  const formatActivityItem = (activity) => {
    const actionColors = {
      registered: 'blue',
      added: 'green',
      pending: 'orange',
      approved: 'green',
      rejected: 'red',
      active: 'green',
      inactive: 'grey'
    };
    
    return (
      <div className="activity-item" key={`${activity.type}-${activity.timestamp}`}>
        <div className="activity-icon">
          <i className={`fas fa-${activity.type === 'user' ? 'user' : activity.type === 'property' ? 'home' : 'clipboard-list'}`}></i>
        </div>
        <div className="activity-details">
          <p>
            <span className="activity-action" style={{ color: `var(--${actionColors[activity.action] || 'blue'})` }}>
              {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
            </span>
            {' '}{activity.item}
          </p>
          <span className="activity-time">{activity.timestamp}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-overview loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-overview error">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={fetchDashboardData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-overview">
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-home"></i>
          </div>
          <div className="stat-content">
            <h3>Total Properties</h3>
            <p className="stat-number">{stats.totalProperties}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>Pending Requests</h3>
            <p className="stat-number">{stats.pendingRequests}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>Active Listings</h3>
            <p className="stat-number">{stats.activeListings}</p>
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map(activity => formatActivityItem(activity))
          ) : (
            <p className="no-activity">No recent activity to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview; 