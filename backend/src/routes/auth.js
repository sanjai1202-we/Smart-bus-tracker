const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const {  email, password, role, college_code, name, phone, parent_phone } = req.body;

  try {
    // Check college
    const { data: college, error: collegeError } = await supabase
      .from('colleges')
      .select('id')
      .eq('code', college_code)
      .single();

    if (!college || collegeError) {
      return res.status(400).json({ error: 'Invalid college code' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([
        { 
          email, 
          password_hash, 
          role, 
          college_id: college.id, 
          name, 
          phone, 
           parent_phone: role === 'student' ? parent_phone : null
        }
      ])
      .select()
      .single();

    if (userError) throw userError;

    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email: user.email, role: user.role }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user || error) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, college_id: user.college_id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, college_id: user.college_id }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, college_id, phone, parent_phone')
      .eq('id', req.user.id)
      .single();
    
    if (error) throw error;
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
