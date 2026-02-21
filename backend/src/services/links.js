import { supabase } from '../db/supabase.js';
import { generateId, generateSlug, extractDomain } from '../utils/helpers.js';
import { fetchMetadata } from './metadata.js';

export async function createLink(userId, linkData) {
  try {
    const { title, url, description, visibility, tags = [] } = linkData;

    // Fetch metadata from URL
    const metadata = await fetchMetadata(url);

    // Use provided title or fall back to fetched title
    const finalTitle = title || metadata.title || extractDomain(url);

    // Create link record
    const linkId = generateId();
    const slug = generateSlug(finalTitle);

    const { data: link, error: linkError } = await supabase
      .from('links')
      .insert({
        id: linkId,
        user_id: userId,
        title: finalTitle,
        url,
        description: description || null,
        visibility: visibility || 'private',
        fetched_title: metadata.title,
        domain: metadata.domain,
        favicon_url: metadata.favicon_url,
        slug,
        click_count: 0
      })
      .select()
      .single();

    if (linkError) throw linkError;

    // Handle tags
    if (tags && tags.length > 0) {
      await associateTags(linkId, tags);
    }

    // Fetch full link with tags
    return await getLink(linkId);
  } catch (error) {
    console.error('Create link error:', error);
    throw error;
  }
}

export async function getLink(linkId, userId = null) {
  try {
    const { data: link, error } = await supabase
      .from('links')
      .select(`
        *,
        link_tags(tag_id(id, name))
      `)
      .eq('id', linkId)
      .single();

    if (error) throw error;

    // Check authorization if userId provided
    if (userId && link.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    return formatLink(link);
  } catch (error) {
    console.error('Get link error:', error);
    throw error;
  }
}

export async function getUserLinks(userId) {
  try {
    const { data: links, error } = await supabase
      .from('links')
      .select(`
        *,
        link_tags(tag_id(id, name))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return links.map(formatLink);
  } catch (error) {
    console.error('Get user links error:', error);
    throw error;
  }
}

export async function updateLink(linkId, userId, updates) {
  try {
    // Verify ownership
    const { data: link, error: fetchError } = await supabase
      .from('links')
      .select('user_id')
      .eq('id', linkId)
      .single();

    if (fetchError || link.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    // Update link
    const updateData = {
      title: updates.title,
      url: updates.url,
      description: updates.description,
      visibility: updates.visibility,
      updated_at: new Date().toISOString()
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const { data: updated, error: updateError } = await supabase
      .from('links')
      .update(updateData)
      .eq('id', linkId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update tags if provided
    if (updates.tags) {
      await supabase.from('link_tags').delete().eq('link_id', linkId);
      if (updates.tags.length > 0) {
        await associateTags(linkId, updates.tags);
      }
    }

    return await getLink(linkId, userId);
  } catch (error) {
    console.error('Update link error:', error);
    throw error;
  }
}

export async function deleteLink(linkId, userId) {
  try {
    // Verify ownership
    const { data: link, error: fetchError } = await supabase
      .from('links')
      .select('user_id')
      .eq('id', linkId)
      .single();

    if (fetchError || link.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    // Delete associated tags
    await supabase.from('link_tags').delete().eq('link_id', linkId);

    // Delete link
    const { error: deleteError } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    console.error('Delete link error:', error);
    throw error;
  }
}

export async function getPublicLink(slug) {
  try {
    const { data: link, error } = await supabase
      .from('links')
      .select(`
        *,
        link_tags(tag_id(id, name))
      `)
      .eq('slug', slug)
      .eq('visibility', 'public')
      .single();

    if (error) throw error;

    return formatLink(link);
  } catch (error) {
    console.error('Get public link error:', error);
    throw error;
  }
}

export async function incrementClickCount(slug) {
  try {
    const { data: link, error: fetchError } = await supabase
      .from('links')
      .select('id, click_count')
      .eq('slug', slug)
      .eq('visibility', 'public')
      .single();

    if (fetchError) throw fetchError;

    // Update click count
    const { error: updateError } = await supabase
      .from('links')
      .update({ click_count: link.click_count + 1 })
      .eq('id', link.id);

    if (updateError) throw updateError;

    // Log click if audit table exists
    try {
      await supabase
        .from('link_clicks')
        .insert({
          link_id: link.id,
          user_agent: null,
          referrer: null
        });
    } catch (e) {
      // Audit table might not exist, that's ok
    }

    return link.click_count + 1;
  } catch (error) {
    console.error('Increment click error:', error);
    throw error;
  }
}

async function associateTags(linkId, tagNames) {
  try {
    for (const tagName of tagNames) {
      // Get or create tag
      let { data: tag, error: fetchError } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName.toLowerCase())
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!tag) {
        const { data: newTag, error: insertError } = await supabase
          .from('tags')
          .insert({ name: tagName.toLowerCase() })
          .select()
          .single();

        if (insertError) throw insertError;
        tag = newTag;
      }

      // Associate tag with link
      const { error: linkTagError } = await supabase
        .from('link_tags')
        .insert({
          link_id: linkId,
          tag_id: tag.id
        });

      if (linkTagError && linkTagError.code !== '23505') {
        // 23505 is duplicate key error, which we ignore
        throw linkTagError;
      }
    }
  } catch (error) {
    console.error('Associate tags error:', error);
    throw error;
  }
}

function formatLink(link) {
  return {
    id: link.id,
    title: link.title,
    url: link.url,
    description: link.description,
    visibility: link.visibility,
    fetchedTitle: link.fetched_title,
    domain: link.domain,
    faviconUrl: link.favicon_url,
    clickCount: link.click_count,
    slug: link.slug,
    tags: link.link_tags ? link.link_tags.map(lt => ({
      id: lt.tag_id.id,
      name: lt.tag_id.name
    })) : [],
    createdAt: link.created_at,
    updatedAt: link.updated_at
  };
}
