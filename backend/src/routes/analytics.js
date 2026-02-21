import express from 'express';
import { supabase } from '../db/supabase.js';

const router = express.Router();

// Get analytics data
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    // Get all links for user
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId);

    if (linksError) throw linksError;

    // Calculate metrics
    const totalLinks = links.length;
    const publicLinks = links.filter(l => l.visibility === 'public');
    const privateLinks = links.filter(l => l.visibility === 'private');
    const totalClicks = links.reduce((sum, link) => sum + (link.click_count || 0), 0);

    // Find most visited
    const mostVisited = links.reduce((prev, current) => {
      return (prev && prev.click_count > current.click_count) ? prev : current;
    }, null);

    // Get links grouped by tags
    const { data: tagData, error: tagError } = await supabase
      .from('link_tags')
      .select(`
        tag_id(id, name),
        link_id
      `)
      .in('link_id', links.map(l => l.id));

    const tagStats = {};
    if (tagData) {
      tagData.forEach(item => {
        const tagName = item.tag_id.name;
        tagStats[tagName] = (tagStats[tagName] || 0) + 1;
      });
    }

    res.json({
      totalLinks,
      publicCount: publicLinks.length,
      privateCount: privateLinks.length,
      totalClicks,
      mostVisited: mostVisited ? {
        id: mostVisited.id,
        title: mostVisited.title,
        clickCount: mostVisited.click_count
      } : null,
      tagBreakdown: Object.entries(tagStats).map(([name, count]) => ({
        name,
        count
      }))
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
