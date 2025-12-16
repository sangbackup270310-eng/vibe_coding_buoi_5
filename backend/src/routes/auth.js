import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { isValidEmail, validatePassword } from '../utils/validation.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, display_name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: passwordValidation.error,
      });
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (expected for new user)
      console.error('Error checking existing user:', checkError);
    }

    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered',
      });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user profile
    const { data: newUser, error: insertError } = await supabase
      .from('profiles')
      .insert({
        email: email.toLowerCase(),
        password_hash,
        display_name: display_name || null,
      })
      .select('id, email, display_name, created_at')
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return res.status(500).json({
        error: 'Registration failed. Please try again.',
      });
    }

    // Return success response
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        display_name: newUser.display_name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Registration failed. Please try again.',
    });
  }
});

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Find user by email
    const { data: user, error: findError } = await supabase
      .from('profiles')
      .select('id, email, password_hash, display_name')
      .eq('email', email.toLowerCase())
      .single();

    if (findError || !user) {
      // Don't reveal if email exists or not (security best practice)
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const { generateToken } = await import('../config/jwt.js');
    const token = generateToken({
      user_id: user.id,
      email: user.email,
    });

    // Return token and user info (without password_hash)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed. Please try again.',
    });
  }
});

export default router;
