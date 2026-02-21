-- LinkVault Database Schema Setup
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/[your-project]/sql/new

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  visibility TEXT CHECK (visibility IN ('public', 'private')) DEFAULT 'private',
  fetched_title TEXT,
  domain TEXT,
  favicon_url TEXT,
  click_count INTEGER DEFAULT 0,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create link_tags join table
CREATE TABLE IF NOT EXISTS public.link_tags (
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (link_id, tag_id)
);

-- Create link_clicks table
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_slug ON public.links(slug);
CREATE INDEX IF NOT EXISTS idx_links_visibility ON public.links(visibility);
CREATE INDEX IF NOT EXISTS idx_link_tags_link_id ON public.link_tags(link_id);
CREATE INDEX IF NOT EXISTS idx_link_tags_tag_id ON public.link_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON public.link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_visited_at ON public.link_clicks(visited_at);

-- Enable Row Level Security
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for links table
CREATE POLICY "Users can read own links" ON public.links
  FOR SELECT USING (auth.uid() = user_id OR visibility = 'public');

CREATE POLICY "Users can insert own links" ON public.links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links" ON public.links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links" ON public.links
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for tags table
CREATE POLICY "Anyone can read tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage tags" ON public.tags
  FOR ALL USING (true);

-- Create RLS policies for link_tags table
CREATE POLICY "Users can read link tags" ON public.link_tags
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own link tags" ON public.link_tags
  FOR ALL USING (
    link_id IN (SELECT id FROM public.links WHERE user_id = auth.uid())
  );

-- Create RLS policies for link_clicks table
CREATE POLICY "Anyone can insert link clicks" ON public.link_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read link clicks" ON public.link_clicks
  FOR SELECT USING (true);
