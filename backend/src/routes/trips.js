const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken, requireRole } = require('../middleware/auth');
const redis = require('../config/redis');

// Start Trip (Driver constraint)
router.post('/start', verifyToken, requireRole(['driver']), async (req, res) => {
  try {
    const { route_id, pairingCode } = req.body;
    
    if (!pairingCode) return res.status(400).json({ error: 'Pairing code is required' });

    // Find the bus by pairing code and ensure it is from the same college
    const { data: bus } = await supabase
      .from('buses')
      .select('id, college_id')
      .eq('pairing_code', pairingCode.toUpperCase())
      .eq('college_id', req.user.college_id)
      .single();

    if (!bus) return res.status(404).json({ error: 'Invalid pairing code' });

    // Fetch existing driver profile or create it
    let { data: driver } = await supabase
      .from('drivers')
      .select('id, bus_id')
      .eq('user_id', req.user.id)
      .single();
      
    if (!driver) {
       const { data: newDriver, error: driverCreationError } = await supabase.from('drivers').insert([
         { user_id: req.user.id, college_id: req.user.college_id, license_number: 'PENDING', bus_id: bus.id }
       ]).select().single();
       if (driverCreationError) throw driverCreationError;
       driver = newDriver;
    } else if (driver.bus_id !== bus.id) {
       // Re-assign driver to this bus dynamically
       await supabase.from('drivers').update({ bus_id: bus.id }).eq('id', driver.id);
       driver.bus_id = bus.id;
    }

    // Mark existing active trips for this bus as completed (safety)
    await supabase.from('trips').update({ status: 'completed', ended_at: new Date() }).eq('bus_id', bus.id).eq('status', 'active');

    // Create new trip
    const { data: trip, error } = await supabase
      .from('trips')
      .insert([{
        bus_id: bus.id,
        driver_id: driver.id,
        route_id: route_id || null,
        status: 'active',
        started_at: new Date()
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Trip started', trip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop Trip (Driver constraint)
router.post('/stop', verifyToken, requireRole(['driver']), async (req, res) => {
   try {
     const { trip_id } = req.body;
     const { data: trip, error } = await supabase
       .from('trips')
       .update({ status: 'completed', ended_at: new Date() })
       .eq('id', trip_id)
       .select()
       .single();

     if (error) throw error;
     
     // Clean cache
     await redis.del(`location:${trip.id}`);
     
     res.json({ message: 'Trip completed', trip });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Get active trips for a college (Used by Students and Admins)
router.get('/active', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('get_active_trips_by_college', { p_college_id: req.user.college_id });
      // Note: Needs a custom function in Supabase, or we just do a join here
    
    // Instead of rpc, do join query
    const { data: tripsData, error: tripsError } = await supabase
      .from('trips')
      .select('id, status, started_at, buses(id, bus_number, plate_number, college_id), drivers(users(name, phone)), routes(name, stops)')
      .eq('status', 'active');
      
    if (tripsError) throw tripsError;
    
    // Filter by college_id
    const filtered = tripsData.filter(t => t.buses.college_id === req.user.college_id);

    // Fetch cached locations from Redis for all active trips
    const results = await Promise.all(filtered.map(async (trip) => {
       const loc = await redis.get(`location:${trip.id}`);
       return {
         ...trip,
         live_location: loc ? JSON.parse(loc) : null
       };
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Board Bus (Student)
router.post('/board', verifyToken, async (req, res) => {
  try {
    const { bus_id } = req.body;
    
    // Get user details (including parent phone)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('name, parent_phone')
      .eq('id', req.user.id)
      .single();

    if (userError || !user) throw new Error('User not found');
    
    // Get bus details
    const { data: bus, error: busError } = await supabase
      .from('buses')
      .select('bus_number')
      .eq('id', bus_id)
      .single();

    if (busError || !bus) throw new Error('Bus not found');

    // Send SMS to parent if phone exists
    if (user.parent_phone) {
      const { sendSMS } = require('../config/twilio');
      const message = `ROUTEX: Your ward ${user.name} has safely boarded Bus ${bus.bus_number}. Tracking is live.`;
      try {
        await sendSMS(user.parent_phone, message);
      } catch (smsError) {
        console.error('[SMS] Failed to send boarding alert:', smsError);
        // We don't fail the request if SMS fails, just log it
      }
    }

    res.json({ success: true, message: 'Boarding confirmed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
