import express from 'express';
import { linkSchema, updateLinkSchema, validateRequest } from '../utils/validation.js';
import {
  createLink,
  getUserLinks,
  getLink,
  updateLink,
  deleteLink
} from '../services/links.js';

const router = express.Router();

// Get all user links
router.get('/', async (req, res) => {
  try {
    const links = await getUserLinks(req.userId);
    res.json(links);
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// Get single link
router.get('/:id', async (req, res) => {
  try {
    const link = await getLink(req.params.id, req.userId);
    res.json(link);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    console.error('Get link error:', error);
    res.status(404).json({ error: 'Link not found' });
  }
});

// Create link
router.post(
  '/',
  validateRequest(linkSchema),
  async (req, res) => {
    try {
      const link = await createLink(req.userId, req.validated);
      res.status(201).json(link);
    } catch (error) {
      console.error('Create link error:', error);
      res.status(500).json({ error: 'Failed to create link' });
    }
  }
);

// Update link
router.put(
  '/:id',
  validateRequest(updateLinkSchema),
  async (req, res) => {
    try {
      const link = await updateLink(req.params.id, req.userId, req.validated);
      res.json(link);
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      console.error('Update link error:', error);
      res.status(500).json({ error: 'Failed to update link' });
    }
  }
);

// Delete link
router.delete('/:id', async (req, res) => {
  try {
    await deleteLink(req.params.id, req.userId);
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    console.error('Delete link error:', error);
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

export default router;
