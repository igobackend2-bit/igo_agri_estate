
import { supabase } from '../lib/supabaseClient';
import { fallbackProperties } from '../data/properties';
import { normalizeProperty } from '../data/properties';

export const seedDatabase = async () => {
  console.log('Starting database seed...');
  
  try {
    // 1. Seed Properties
    const normalized = fallbackProperties.map(normalizeProperty);
    
    for (const prop of normalized) {
      const { data, error } = await supabase
        .from('properties')
        .upsert([prop], { onConflict: 'id' })
        .select();
        
      if (error) {
        console.error(`Error seeding property ${prop.title}:`, error.message);
      } else {
        console.log(`Seeded property: ${prop.title}`);
      }
    }
    
    console.log('Database seed completed successfully.');
    return true;
  } catch (err) {
    console.error('Seed failed:', err);
    return false;
  }
};
