import express from 'express';
import { supabase } from '../db/supabase.js';
import { signupSchema, loginSchema, validateRequest } from '../utils/validation.js';

const router = express.Router();

// Signup
router.post(
  '/signup',
  validateRequest(signupSchema),
  async (req, res) => {
    try {
      const { email, password } = req.validated;

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({
        user: data.user,
        message: 'User created successfully'
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: error.message || 'Signup failed' });
    }
  }
);

// Login
router.post(
  '/login',
  validateRequest(loginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.validated;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.json({
        user: data.user,
        session: data.session
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Logout (just returns success - client destroys token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
