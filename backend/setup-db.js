import { createClient } from '@supabase/supabase-js';
import './config.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...\n');

    // Get admin client for raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.tags (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT UNIQUE NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

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

        CREATE TABLE IF NOT EXISTS public.link_tags (
          link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
          tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
          PRIMARY KEY (link_id, tag_id)
        );

        CREATE TABLE IF NOT EXISTS public.link_clicks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
          visited_at TIMESTAMPTZ DEFAULT NOW(),
          user_agent TEXT,
          referrer TEXT
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
        CREATE INDEX IF NOT EXISTS idx_links_slug ON public.links(slug);
        CREATE INDEX IF NOT EXISTS idx_links_visibility ON public.links(visibility);
        CREATE INDEX IF NOT EXISTS idx_link_tags_link_id ON public.link_tags(link_id);
        CREATE INDEX IF NOT EXISTS idx_link_tags_tag_id ON public.link_tags(tag_id);
        CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON public.link_clicks(link_id);
        CREATE INDEX IF NOT EXISTS idx_link_clicks_visited_at ON public.link_clicks(visited_at);

        -- Enable RLS
        ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

        -- Create policies for links table
        CREATE POLICY IF NOT EXISTS "Users can read own links" ON public.links
          FOR SELECT USING (auth.uid() = user_id OR visibility = 'public');

        CREATE POLICY IF NOT EXISTS "Users can insert own links" ON public.links
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can update own links" ON public.links
          FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can delete own links" ON public.links
          FOR DELETE USING (auth.uid() = user_id);

        -- Create policies for tags table
        CREATE POLICY IF NOT EXISTS "Anyone can read tags" ON public.tags
          FOR SELECT USING (true);

        CREATE POLICY IF NOT EXISTS "Service role can manage tags" ON public.tags
          FOR ALL USING (true);

        -- Create policies for link_tags table
        CREATE POLICY IF NOT EXISTS "Users can read link tags" ON public.link_tags
          FOR SELECT USING (true);

        CREATE POLICY IF NOT EXISTS "Users can manage own link tags" ON public.link_tags
          FOR ALL USING (
            link_id IN (SELECT id FROM public.links WHERE user_id = auth.uid())
          );

        -- Create policies for link_clicks table
        CREATE POLICY IF NOT EXISTS "Anyone can insert link clicks" ON public.link_clicks
          FOR INSERT WITH CHECK (true);

        CREATE POLICY IF NOT EXISTS "Anyone can read link clicks" ON public.link_clicks
          FOR SELECT USING (true);
      `
    });

    if (error) {
      throw error;
    }

    console.log('✅ Database schema created successfully!\n');
    process.exit(0);
  } catch (error) {
    if (error.message && error.message.includes('does not exist')) {
      console.log('⚠️  Note: exec_sql RPC function not available.');
      console.log('📋 Please create tables manually in Supabase SQL editor:\n');
      console.log(`
-- Create tables
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.link_tags (
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (link_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

-- Create indexes
CREATE INDEX idx_links_user_id ON public.links(user_id);
CREATE INDEX idx_links_slug ON public.links(slug);
CREATE INDEX idx_links_visibility ON public.links(visibility);
CREATE INDEX idx_link_tags_link_id ON public.link_tags(link_id);
CREATE INDEX idx_link_tags_tag_id ON public.link_tags(tag_id);
CREATE INDEX idx_link_clicks_link_id ON public.link_clicks(link_id);
      `);
      process.exit(1);
    }
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
