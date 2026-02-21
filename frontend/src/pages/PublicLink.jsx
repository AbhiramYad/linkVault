import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api.js';
import '../styles/public-link.css';

export default function PublicLink() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const { data } = await api.get(`/api/public/l/${slug}`);
        setLink(data);
      } catch (err) {
        setError('Link not found');
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [slug]);

  if (loading) {
    return <div className="public-link-container"><p>Loading...</p></div>;
  }

  if (error || !link) {
    return (
      <div className="public-link-container">
        <div className="error-box">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-link-container">
      <div className="public-link-card">
        {link.faviconUrl && (
          <img src={link.faviconUrl} alt="favicon" className="favicon" />
        )}

        <h1>{link.title}</h1>

        {link.description && (
          <p className="description">{link.description}</p>
        )}

        <div className="link-meta">
          <span className="domain">{link.domain}</span>
          <span className="click-count">👁️ {link.clickCount} {'visit' + (link.clickCount !== 1 ? 's' : '')}</span>
        </div>

        {link.tags && link.tags.length > 0 && (
          <div className="tags">
            {link.tags.map((tag, idx) => (
              <span key={idx} className="tag">{tag.name}</span>
            ))}
          </div>
        )}

        <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary cta">
          Visit Link →
        </a>

        <button className="btn btn-secondary back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
