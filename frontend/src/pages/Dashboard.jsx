import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLinks, createLink, updateLink, deleteLink } from '../redux/slices/links.js';
import LinkCard from '../components/LinkCard.jsx';
import CreateLinkForm from '../components/CreateLinkForm.jsx';
import '../styles/dashboard.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: links, isLoading, error } = useSelector(state => state.links);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [filterVisibility, setFilterVisibility] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchLinks());
  }, [dispatch]);

  const handleCreateLink = async (formData) => {
    try {
      await dispatch(createLink(formData));
      setShowForm(false);
      setEditingLink(null);
    } catch (err) {
      console.error('Failed to create link:', err);
    }
  };

  const handleUpdateLink = async (linkId, updates) => {
    try {
      await dispatch(updateLink(linkId, updates));
      setEditingLink(null);
    } catch (err) {
      console.error('Failed to update link:', err);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await dispatch(deleteLink(linkId));
      } catch (err) {
        console.error('Failed to delete link:', err);
      }
    }
  };

  const filteredLinks = links.filter(link => {
    if (filterVisibility !== 'all' && link.visibility !== filterVisibility) return false;
    if (searchTerm && !link.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Links</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingLink(null);
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Link'}
        </button>
      </div>

      {showForm && (
        <CreateLinkForm
          onSubmit={handleCreateLink}
          initialData={editingLink}
          isLoading={isLoading}
        />
      )}

      <div className="dashboard-filters">
        <input
          type="text"
          placeholder="Search links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterVisibility === 'all' ? 'active' : ''}`}
            onClick={() => setFilterVisibility('all')}
          >
            All ({links.length})
          </button>
          <button
            className={`filter-btn ${filterVisibility === 'public' ? 'active' : ''}`}
            onClick={() => setFilterVisibility('public')}
          >
            Public ({links.filter(l => l.visibility === 'public').length})
          </button>
          <button
            className={`filter-btn ${filterVisibility === 'private' ? 'active' : ''}`}
            onClick={() => setFilterVisibility('private')}
          >
            Private ({links.filter(l => l.visibility === 'private').length})
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="links-grid">
        {filteredLinks.length === 0 ? (
          <div className="no-links">
            <p>No links saved yet. Create your first link!</p>
          </div>
        ) : (
          filteredLinks.map(link => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={() => {
                setEditingLink(link);
                setShowForm(true);
              }}
              onDelete={() => handleDeleteLink(link.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
