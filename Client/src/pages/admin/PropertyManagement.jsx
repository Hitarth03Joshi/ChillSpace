import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminComponents.scss';
import { useNavigate } from 'react-router-dom';
const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  
  
  const navigate = useNavigate();
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/properties/getalllisting');
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`http://localhost:3001/properties/delete/${propertyId}`);
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / rowsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  return (
    <div className="property-management">
      <div className="filters-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={handleFilterChange}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="properties-grid">
        {paginatedProperties.map(property => (
          <div key={property._id} className="property-card">
            <img 
              src={property.listingPhotoPaths?.[0] || '/placeholder-property.jpg'} 
              alt={property.title}
              className="property-image"
            />
            <div className="property-info">
              <div className="property-header">
                <h3>{property.title}</h3>
                <span className="property-price">${property.price}/night</span>
              </div>
              
              <div className="property-location">
                <i className="fas fa-map-marker-alt"></i>
                {property.location}
              </div>

              <div className="property-stats">
                <div className="stat-item">
                  <span className="stat-value">{property.bedrooms}</span>
                  <span className="stat-label">Bedrooms</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{property.bathrooms}</span>
                  <span className="stat-label">Bathrooms</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{property.maxGuests}</span>
                  <span className="stat-label">Max Guests</span>
                </div>
              </div>

              <span className={`property-status ${property.status}`}>
                {property.status}
              </span>

              <div className="property-actions">
                <button className="view-btn" onClick={()=>{navigate(`/properties/${property._id}`)}}>
                  <i className="fas fa-eye"></i>
                  View
                </button>
                <button className="edit-btn" onClick={()=>{navigate(`/properties/${property._id}/updateproperty`)}}>
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteProperty(property._id)}
                >
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-footer">
        <div className="rows-per-page">
          <span>Properties per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
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
    </div>
  );
};

export default PropertyManagement; 