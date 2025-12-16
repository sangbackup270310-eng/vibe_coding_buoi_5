/**
 * Validation utilities for authentication and profile data
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long',
    };
  }

  return { valid: true };
};

/**
 * Validate height in cm
 * @param {number} height - Height in cm
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateHeight = (height) => {
  if (height === null || height === undefined) {
    return { valid: true }; // Optional field
  }

  const heightNum = Number(height);
  if (isNaN(heightNum)) {
    return { valid: false, error: 'Height must be a number' };
  }

  if (heightNum < 100 || heightNum > 250) {
    return {
      valid: false,
      error: 'Height must be between 100 and 250 cm',
    };
  }

  return { valid: true };
};

/**
 * Validate weight in kg
 * @param {number} weight - Weight in kg
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateWeight = (weight) => {
  if (weight === null || weight === undefined) {
    return { valid: true }; // Optional field
  }

  const weightNum = Number(weight);
  if (isNaN(weightNum)) {
    return { valid: false, error: 'Weight must be a number' };
  }

  if (weightNum < 30 || weightNum > 250) {
    return {
      valid: false,
      error: 'Weight must be between 30 and 250 kg',
    };
  }

  return { valid: true };
};

/**
 * Validate display name
 * @param {string} displayName - Display name to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateDisplayName = (displayName) => {
  if (!displayName || displayName.trim() === '') {
    return { valid: true }; // Optional field
  }

  if (displayName.length > 100) {
    return {
      valid: false,
      error: 'Display name must be 100 characters or less',
    };
  }

  return { valid: true };
};
