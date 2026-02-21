import { supabase } from './supabase.js';

export async function initializeDatabase() {
  try {
    console.log('Initializing database schema...');
    
    // Tables are pre-configured in Supabase dashboard
    // This function verifies the connection works
    const { error: testError } = await supabase
      .from('links')
      .select('id')
      .limit(1);
    
    if (testError && testError.code !== 'PGRST116') {
      // PGRST116 is "Relation does not exist" - expected if no links yet
      throw testError;
    }
    
    console.log('✓ Database connection verified successfully');
  } catch (error) {
    console.error('Database initialization warning:', error.message);
    // Schema should be pre-configured in Supabase
  }
}
