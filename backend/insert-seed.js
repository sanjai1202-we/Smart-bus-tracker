require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function seed() {
  console.log('Inserting Demo College...');
  
  const { data, error } = await supabase.from('colleges')
    .insert([
      { name: 'Demo University', code: 'DEMO-123', logo_url: 'https://ui-avatars.com/api/?name=Demo+Univ' }
    ])
    .select();
    
  if (error) {
    console.error('Failed to insert:', error.message);
  } else {
    console.log('Success! College inserted:', data);
    
    // Insert a dummy bus too
    const { data: busData, error: busError } = await supabase.from('buses')
      .insert([
         { college_id: data[0].id, bus_number: 'Bus-01', capacity: 50, plate_number: 'XYZ-9876' }
      ]);
      
    if (busError) console.error('Failed to insert Bus:', busError.message);
    else console.log('Successfully added Bus-01!');
  }
}

seed();
