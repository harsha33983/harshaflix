import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    displayName: '',
    emailNotifications: false,
    darkMode: false
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Initialize form data with current user info
    setFormData(prev => ({
      ...prev,
      displayName: currentUser.displayName || '',
      darkMode: localStorage.getItem('darkMode') === 'true'
    }));

    // Apply dark mode if saved
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const updates = [];

      // Update display name if changed
      if (formData.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: formData.displayName
        });
        updates.push('displayName');
      }

      // Apply dark mode change
      const previousDarkMode = localStorage.getItem('darkMode') === 'true';
      if (formData.darkMode !== previousDarkMode) {
        if (formData.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', formData.darkMode.toString());
        updates.push('darkMode');
      }

      // Save notification preference
      const previousNotifications = localStorage.getItem('emailNotifications') === 'true';
      if (formData.emailNotifications !== previousNotifications) {
        localStorage.setItem('emailNotifications', formData.emailNotifications.toString());
        updates.push('notifications');
      }

      // Set appropriate success message
      if (updates.includes('displayName')) {
        setSuccess('Your Streamflix display name has been successfully updated!');
      } else if (updates.length > 0) {
        setSuccess('Your Streamflix preferences have been updated successfully.');
      } else {
        setSuccess('No changes were made to your profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="w-6 h-6" />
            Profile Settings
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-md text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-900/50 border border-green-700 rounded-md text-green-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  {currentUser?.displayName || 'Set your display name'}
                </h3>
                <p className="text-gray-400">{currentUser?.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Profile picture updates coming soon
                </p>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-1">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent"
                placeholder="Enter your display name"
                maxLength={50}
              />
            </div>

            {/* Preferences */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preferences
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="rounded bg-gray-800 border-gray-700 text-[#E50914] focus:ring-[#E50914]"
                  />
                  <span>Email notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.darkMode}
                    onChange={(e) => setFormData(prev => ({ ...prev, darkMode: e.target.checked }))}
                    className="rounded bg-gray-800 border-gray-700 text-[#E50914] focus:ring-[#E50914]"
                  />
                  <span>Dark mode</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E50914] text-white px-6 py-2 rounded hover:bg-[#f6121d] transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;