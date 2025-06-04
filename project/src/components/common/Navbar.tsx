import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Film, Tv, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileMenu(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled || showMobileMenu ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-[#E50914] font-bold text-2xl md:text-3xl">
          STREAMFLIX
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`hover:text-white transition ${
              location.pathname === '/' ? 'text-white' : 'text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            className={`hover:text-white transition flex items-center gap-1 ${
              location.pathname === '/movies' ? 'text-white' : 'text-gray-300'
            }`}
          >
            <Film size={16} />
            Movies
          </Link>
          <Link 
            to="/tv" 
            className={`hover:text-white transition flex items-center gap-1 ${
              location.pathname === '/tv' ? 'text-white' : 'text-gray-300'
            }`}
          >
            <Tv size={16} />
            TV Shows
          </Link>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/50 border border-gray-600 rounded py-1 px-3 pl-9 text-sm focus:outline-none focus:border-gray-400 text-white w-[180px] transition-all focus:w-[220px]"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>

          {/* Auth Links */}
          {currentUser ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/profile"
                className="flex items-center gap-1 text-gray-300 hover:text-white transition"
              >
                <User size={16} />
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-300 hover:text-white transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-[#E50914] text-white px-4 py-1 rounded hover:bg-[#f6121d] transition"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-[#141414] p-4">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/50 border border-gray-600 rounded py-2 px-3 pl-9 text-sm focus:outline-none focus:border-gray-400 text-white w-full"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>
          
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`hover:text-white transition ${
                location.pathname === '/' ? 'text-white' : 'text-gray-300'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className={`hover:text-white transition flex items-center gap-1 ${
                location.pathname === '/movies' ? 'text-white' : 'text-gray-300'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <Film size={16} />
              Movies
            </Link>
            <Link 
              to="/tv" 
              className={`hover:text-white transition flex items-center gap-1 ${
                location.pathname === '/tv' ? 'text-white' : 'text-gray-300'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <Tv size={16} />
              TV Shows
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/profile"
                  className="flex items-center gap-1 text-gray-300 hover:text-white transition"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <User size={16} />
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-1 text-gray-300 hover:text-white transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-[#E50914] text-white px-4 py-2 rounded hover:bg-[#f6121d] transition text-center"
                onClick={() => setShowMobileMenu(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;