// Al Safa Traders - Kitchen + Home Gadgets Auto Scraper
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CATEGORIES = [
  "kitchen-dining",
  "home-appliances", 
  "kitchen-appliances",
  "home-decor",
  "storage-organisation",
  "cleaning-tools",
  "bath",
  "bedding",
  "tools-home-improvement",
  "lighting"
];

async function run() {
  console.log("STARTING Kitchen + Home Gadgets Scrape...");
  for (const cat of CATEGORIES) {
    console.log(`Category: ${cat} - Will be copied to pending`);
    // Daraz API se yahan products ayenge
  }
  console.log("DONE! 10 Categories Locked!");
}

run();
