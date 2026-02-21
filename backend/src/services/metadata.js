import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { extractDomain } from '../utils/helpers.js';

export async function fetchMetadata(urlString) {
  const metadata = {
    title: null,
    favicon_url: null,
    domain: extractDomain(urlString),
    error: null
  };

  try {
    const response = await fetch(urlString, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });

    if (!response.ok) {
      metadata.error = `HTTP ${response.status}`;
      return metadata;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract page title
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const titleTag = $('title').text();
    metadata.title = ogTitle || titleTag || null;

    // Extract favicon
    // Try multiple favicon link types
    let favicon = $('link[rel="icon"]').attr('href');
    if (!favicon) {
      favicon = $('link[rel="shortcut icon"]').attr('href');
    }
    if (!favicon) {
      favicon = $('link[rel="apple-touch-icon"]').attr('href');
    }

    if (favicon) {
      // Convert relative URLs to absolute
      if (favicon.startsWith('/')) {
        const domain = new URL(urlString);
        metadata.favicon_url = `${domain.protocol}//${domain.hostname}${favicon}`;
      } else if (!favicon.startsWith('http')) {
        const domain = new URL(urlString);
        metadata.favicon_url = `${domain.protocol}//${domain.hostname}/${favicon}`;
      } else {
        metadata.favicon_url = favicon;
      }
    }

    // Fallback: try to use default favicon path
    if (!metadata.favicon_url) {
      const domain = new URL(urlString);
      metadata.favicon_url = `${domain.protocol}//${domain.hostname}/favicon.ico`;
    }

    return metadata;
  } catch (error) {
    metadata.error = error.message;
    console.error('Metadata fetch error:', error);
    return metadata;
  }
}
