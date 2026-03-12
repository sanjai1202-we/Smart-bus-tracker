require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function createAdminAndDriver() {
  console.log('Fetching Demo College ID...');
  const { data: college } = await supabase.from('colleges').select('id, code').eq('code', 'DEMO-123').single();
  const college_id = college.id;

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash('password123', salt);

  console.log('Creating Admin User...');
  const { data: adminUser, error: adminError } = await supabase.from('users').insert([
    { email: 'admin@demo.edu', password_hash, role: 'admin', college_id, name: 'Campus Admin', phone: '555-0001' }
  ]).select().single();
  
  if (adminError) console.error('Admin Error:', adminError.message);

  console.log('Creating Driver User...');
  const { data: driverUser, error: driverError } = await supabase.from('users').insert([
    { email: 'driver@demo.edu', password_hash, role: 'driver', college_id, name: 'John Driver', phone: '555-0002' }
  ]).select().single();

  if (driverError) {
     console.error('Driver Error:', driverError.message);
     return;
  }

  // Fetch the first bus we created earlier
  const { data: bus } = await supabase.from('buses').select('id').eq('college_id', college_id).single();

  console.log('Assigning Driver to Bus...');
  const { data: driverAssignment, error: assignmentError } = await supabase.from('drivers').insert([
    { user_id: driverUser.id, college_id, license_number: 'DL-987654321', bus_id: bus.id }
  ]);

  if (assignmentError) console.error('Assignment Error:', assignmentError.message);
  else console.log('Successfully created Admin and Driver!');
}

createAdminAndDriver();
