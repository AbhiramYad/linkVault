import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-content">
          <h1>LinkVault</h1>
          <p className="tagline">Smart Link Sharing Platform</p>
          <p className="description">
            Save, organize, and share your favorite links while tracking engagement analytics.
          </p>

          <div className="features">
            <div className="feature">
              <h3>💾 Save Links</h3>
              <p>Organize links with titles, descriptions, and tags</p>
            </div>
            <div className="feature">
              <h3>📊 Track Analytics</h3>
              <p>Monitor how many times your links are visited</p>
            </div>
            <div className="feature">
              <h3>🔗 Share Publicly</h3>
              <p>Generate shareable URLs for public links</p>
            </div>
            <div className="feature">
              <h3>🏷️ Organize with Tags</h3>
              <p>Categorize links for easy management</p>
            </div>
          </div>

          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>
              Get Started
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
