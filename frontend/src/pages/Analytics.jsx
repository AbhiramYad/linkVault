import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../redux/slices/analytics.js';
import '../styles/analytics.css';

export default function Analytics() {
  const dispatch = useDispatch();
  const analytics = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  return (
    <div className="analytics">
      <h1>Analytics Dashboard</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Links</h3>
          <div className="metric-value">{analytics.totalLinks}</div>
        </div>

        <div className="metric-card">
          <h3>Public Links</h3>
          <div className="metric-value">{analytics.publicCount}</div>
        </div>

        <div className="metric-card">
          <h3>Private Links</h3>
          <div className="metric-value">{analytics.privateCount}</div>
        </div>

        <div className="metric-card">
          <h3>Total Clicks</h3>
          <div className="metric-value">{analytics.totalClicks}</div>
        </div>
      </div>

      {analytics.mostVisited && (
        <div className="most-visited-card">
          <h2>Most Visited Link</h2>
          <div className="visited-content">
            <h3>{analytics.mostVisited.title}</h3>
            <p className="click-count">{analytics.mostVisited.clickCount} clicks</p>
          </div>
        </div>
      )}

      {analytics.tagBreakdown.length > 0 && (
        <div className="tag-breakdown">
          <h2>Links by Tag</h2>
          <div className="tag-list">
            {analytics.tagBreakdown.map((tag, idx) => (
              <div key={idx} className="tag-item">
                <span className="tag-name">{tag.name}</span>
                <span className="tag-count">{tag.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
