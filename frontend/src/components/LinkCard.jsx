import React, { useState } from 'react';
import '../styles/link-card.css';

export default function LinkCard({ link, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const publicUrl = link.visibility === 'public'
    ? `${window.location.origin}/l/${link.slug}`
    : null;

  const handleCopyUrl = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openLink = () => {
    window.open(link.url, '_blank');
  };

  return (
    <div className="link-card">
      <div className="link-card-header">
        {link.faviconUrl && (
          <img src={link.faviconUrl} alt={link.domain} className="link-favicon" />
        )}
        <div className="link-title-container">
          <h3>{link.title}</h3>
          <p className="link-domain">{link.domain}</p>
        </div>
      </div>

      {link.description && (
        <p className="link-description">{link.description}</p>
      )}

      {link.tags && link.tags.length > 0 && (
        <div className="link-tags">
          {link.tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag.name}</span>
          ))}
        </div>
      )}

      <div className="link-stats">
        <span className="visibility-badge" data-visibility={link.visibility}>
          {link.visibility === 'public' ? '🔓' : '🔒'} {link.visibility}
        </span>
        <span className="click-count">👁️ {link.clickCount} clicks</span>
      </div>

      <div className="link-actions">
        <button className="btn btn-small" onClick={openLink}>
          Open Link
        </button>
        <button className="btn btn-small" onClick={onEdit}>
          Edit
        </button>
        {publicUrl && (
          <button className="btn btn-small" onClick={handleCopyUrl}>
            {copied ? '✓ Copied' : 'Copy URL'}
          </button>
        )}
        <button className="btn btn-small btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
