import React, { useState, useEffect } from 'react';
import '../styles/create-link-form.css';

export default function CreateLinkForm({ onSubmit, initialData, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    visibility: 'private',
    tags: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        url: initialData.url,
        description: initialData.description || '',
        visibility: initialData.visibility,
        tags: initialData.tags.map(t => t.name).join(', ')
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.url.trim()) {
      setError('URL is required');
      return;
    }

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      onSubmit({
        title: formData.title.trim() || '', // Empty string, backend will extract
        url: formData.url.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
        tags
      });

      // Reset form
      setFormData({
        title: '',
        url: '',
        description: '',
        visibility: 'private',
        tags: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="create-link-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Link' : 'Create New Link'}</h2>

      <div className="form-group">
        <label htmlFor="title">Title (auto-extracted from website)</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Leave empty to auto-extract from website..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">URL *</label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          disabled={isLoading}
          required
          placeholder="https://example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          rows="3"
          placeholder="Add a description for this link..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="visibility">Visibility</label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="private">Private (Only you)</option>
            <option value="public">Public (Anyone with link)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Separate with commas (e.g., design, tools)"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : (initialData ? 'Update Link' : 'Create Link')}
      </button>
    </form>
  );
}
