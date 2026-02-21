import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

export function generateId() {
  return uuidv4();
}

export function generateSlug(title) {
  let slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true
  });

  // Add random suffix to avoid collisions
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${slug}-${randomSuffix}`;
}

export function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}

export function extractDomain(urlString) {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch (error) {
    return null;
  }
}
