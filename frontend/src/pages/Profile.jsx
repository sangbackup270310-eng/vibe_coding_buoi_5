import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api.js';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    display_name: '',
    height_cm: '',
    weight_kg: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data);
      setFormData({
        display_name: response.data.display_name || '',
        height_cm: response.data.height_cm || '',
        weight_kg: response.data.weight_kg || '',
      });
    } catch (error) {
      if (error.response?.status === 401) {
        // Token invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    setIsSaving(true);

    try {
      const response = await api.put('/user/profile', formData);
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-slate-50">Profile</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-50 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Profile Form */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-sm text-emerald-300">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-500">
                Email cannot be changed
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label
                htmlFor="display_name"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Display Name <span className="text-slate-500">(optional)</span>
              </label>
              <input
                type="text"
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Your display name"
              />
            </div>

            {/* Height */}
            <div>
              <label
                htmlFor="height_cm"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Height (cm) <span className="text-slate-500">(optional)</span>
              </label>
              <input
                type="number"
                id="height_cm"
                name="height_cm"
                value={formData.height_cm}
                onChange={handleChange}
                min="100"
                max="250"
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="100-250"
              />
              <p className="mt-1 text-xs text-slate-500">
                Height must be between 100-250 cm
              </p>
            </div>

            {/* Weight */}
            <div>
              <label
                htmlFor="weight_kg"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Weight (kg) <span className="text-slate-500">(optional)</span>
              </label>
              <input
                type="number"
                id="weight_kg"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                min="30"
                max="250"
                step="0.1"
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="30-250"
              />
              <p className="mt-1 text-xs text-slate-500">
                Weight must be between 30-250 kg
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
