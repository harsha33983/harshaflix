import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    // Validate password strength
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (err: any) {
      let errorMessage = 'Failed to create an account';
      
      // Handle specific Firebase error codes
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please sign in or use a different email.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-28">
      <div className="w-full max-w-md bg-black/75 rounded-lg p-8 sm:p-10">
        <h1 className="text-3xl font-bold mb-8 text-white">Sign Up</h1>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded flex items-start gap-2">
            <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent"
              placeholder="Create a password"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] text-white py-3 rounded font-medium hover:bg-[#f6121d] transition disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          
          <div className="text-center text-gray-400">
            Already have an account? <Link to="/login" className="text-white hover:underline">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;