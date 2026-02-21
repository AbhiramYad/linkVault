import express from 'express';
import { supabase } from '../db/supabase.js';
import { getPublicLink, incrementClickCount } from '../services/links.js';

const router = express.Router();

// Get public link and increment click count
router.get('/l/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Get link
    const link = await getPublicLink(slug);
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Increment click count
    const newClickCount = await incrementClickCount(slug);

    // Return link with updated click count
    res.json({
      ...link,
      clickCount: newClickCount
    });
  } catch (error) {
    console.error('Get public link error:', error);
    res.status(404).json({ error: 'Link not found' });
  }
});

// Redirect to actual URL (for simple redirect)
router.get('/r/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Get link
    const link = await getPublicLink(slug);
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Increment click count
    await incrementClickCount(slug);

    // Redirect to actual URL
    res.redirect(link.url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(404).json({ error: 'Link not found' });
  }
});

export default router;
