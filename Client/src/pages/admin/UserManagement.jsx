import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminComponents.scss';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/User/get');
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterRole(e.target.value);
    setCurrentPage(1);
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedUsers(
      e.target.checked 
        ? filteredUsers.map(user => user._id)
        : []
    );
  };

  const handleSuspendUser = async (userId) => {
    try {
      await axios.patch(`http://localhost:3001/users/suspend/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3001/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleViewUserDetails = (user) => {
    setCurrentUser(user);
    setShowUserModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="filters-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <select 
          value={filterRole} 
          onChange={handleFilterChange}
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="host">Host</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <button onClick={() => console.log('Bulk action')}>
            Action on {selectedUsers.length} selected
          </button>
        </div>
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user._id}>
                <td className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                  />
                </td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.roleId.name || 'User'}</td>
                <td>
                  <span className={`status-badge ${user.status?.toLowerCase()}`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td>
                  <div className="user-actions">
                    <button className="edit-btn">
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="rows-per-page">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {showUserModal && currentUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>User Details</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUserModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{currentUser.firstName} {currentUser.lastName}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{currentUser.email}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{currentUser.role || 'user'}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{currentUser.isActive ? 'Active' : 'Suspended'}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Joined Date:</span>
                <span className="detail-value">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Last Login:</span>
                <span className="detail-value">
                  {currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleString() : 'Never'}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="close-modal-btn"
                onClick={() => setShowUserModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 