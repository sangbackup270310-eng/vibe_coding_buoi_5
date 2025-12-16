import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateHeight,
  validateWeight,
  validateDisplayName,
} from '../utils/validation.js';

const router = express.Router();

/**
 * GET /api/user/profile
 * Get current user's profile (protected route)
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, display_name, height_cm, weight_kg, avatar_url, full_body_image_url, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({
        error: 'Failed to fetch profile',
      });
    }

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
    });
  }
});

/**
 * PUT /api/user/profile
 * Update current user's profile (protected route)
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { display_name, height_cm, weight_kg, avatar_url, full_body_image_url } = req.body;

    // Validate optional fields
    if (display_name !== undefined) {
      const nameValidation = validateDisplayName(display_name);
      if (!nameValidation.valid) {
        return res.status(400).json({
          error: nameValidation.error,
        });
      }
    }

    if (height_cm !== undefined && height_cm !== null && height_cm !== '') {
      const heightValidation = validateHeight(Number(height_cm));
      if (!heightValidation.valid) {
        return res.status(400).json({
          error: heightValidation.error,
        });
      }
    }

    if (weight_kg !== undefined && weight_kg !== null && weight_kg !== '') {
      const weightValidation = validateWeight(Number(weight_kg));
      if (!weightValidation.valid) {
        return res.status(400).json({
          error: weightValidation.error,
        });
      }
    }

    // Build update object (only include provided fields)
    const updateData = {};
    if (display_name !== undefined) {
      updateData.display_name = display_name || null;
    }
    if (height_cm !== undefined && height_cm !== null && height_cm !== '') {
      updateData.height_cm = Number(height_cm);
    } else if (height_cm === null || height_cm === '') {
      updateData.height_cm = null;
    }
    if (weight_kg !== undefined && weight_kg !== null && weight_kg !== '') {
      updateData.weight_kg = Number(weight_kg);
    } else if (weight_kg === null || weight_kg === '') {
      updateData.weight_kg = null;
    }
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url || null;
    }
    if (full_body_image_url !== undefined) {
      updateData.full_body_image_url = full_body_image_url || null;
    }

    // Update profile
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('id, email, display_name, height_cm, weight_kg, avatar_url, full_body_image_url, created_at, updated_at')
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({
        error: 'Failed to update profile',
      });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
    });
  }
});

export default router;
