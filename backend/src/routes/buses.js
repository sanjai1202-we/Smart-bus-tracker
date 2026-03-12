const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

// Get all buses for a college
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('buses')
      .select('*, drivers(id, license_number, user_id, users(name))')
      .eq('college_id', req.user.college_id);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new bus
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const { bus_number, capacity, plate_number } = req.body;
  const pairing_code = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    const { data, error } = await supabase
      .from('buses')
      .insert([{ college_id: req.user.college_id, bus_number, capacity, plate_number, pairing_code }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a bus
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  try {
    const { error } = await supabase
      .from('buses')
      .delete()
      .eq('id', req.params.id)
      .eq('college_id', req.user.college_id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
