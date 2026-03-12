require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

// We use the service key to perform administrative actions
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function addMissingColumn() {
  console.log('--- Database Fix: Adding pairing_code column ---');
  
  // Note: Supabase JS client doesn't support raw SQL 'ALTER TABLE' directly.
  // We recommend the user run this in the Supabase SQL Editor.
  console.log('Please copy and run the following command in your Supabase SQL Editor:');
  console.log('\nALTER TABLE buses ADD COLUMN pairing_code VARCHAR(10);\n');
  
  // Let's try to see if we can "trick" it or detect if it's there
  const { error } = await supabase.from('buses').select('pairing_code').limit(1);
  
  if (error && error.message.includes('column "pairing_code" does not exist')) {
    console.log('Confirmed: column "pairing_code" is MISSING.');
  } else if (!error) {
    console.log('Column "pairing_code" already exists.');
  } else {
    console.log('Error checking column:', error.message);
  }
}

addMissingColumn();
