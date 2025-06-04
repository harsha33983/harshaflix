import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const { login, resetPassword, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      let errorMessage = 'Failed to log in';
      
      // Handle specific Firebase error codes
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      let errorMessage = 'Failed to send password reset email';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-28">
      <div className="w-full max-w-md bg-black/75 rounded-lg p-8 sm:p-10">
        <h1 className="text-3xl font-bold mb-8 text-white">Sign In</h1>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded flex items-start gap-2">
            <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}
        
        {/* Password reset confirmation */}
        {resetSent && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded">
            <p className="text-sm text-green-200">
              Password reset link sent to your email. Check your inbox.
            </p>
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
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] text-white py-3 rounded font-medium hover:bg-[#f6121d] transition disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-gray-400 hover:text-gray-300 transition"
            >
              Forgot password?
            </button>
            
            <div className="text-gray-400">
              New to Streamflix? <Link to="/signup" className="text-white hover:underline">Sign up now</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;