// Load config and environment variables FIRST
import './config.js';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local FIRST
dotenv.config({ path: '.env.local' });
dotenv.config(); // Also load from .env

import express from 'express';
import cors from 'cors';

import { initializeDatabase } from './src/db/init.js';
import { authenticateToken } from './src/middleware/auth.js';
import authRoutes from './src/routes/auth.js';
import linkRoutes from './src/routes/links.js';
import publicRoutes from './src/routes/public.js';
import analyticsRoutes from './src/routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initializeDatabase();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/links', authenticateToken, linkRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
}

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`LinkVault backend running on http://localhost:${PORT}`);
});
