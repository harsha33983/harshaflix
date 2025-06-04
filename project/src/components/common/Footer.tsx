import { Github, Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer className="bg-[#141414] py-12 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-[#E50914] font-bold text-xl mb-4">STREAMFLIX</h3>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for movies and TV shows. Stream the latest content anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-white transition">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/tv" className="text-gray-400 hover:text-white transition">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Help & Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded flex-grow text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
              <button
                type="submit"
                className="bg-[#E50914] text-white px-4 py-2 rounded hover:bg-[#f6121d] transition flex items-center gap-2"
              >
                <Mail size={16} />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
            <p className="text-gray-500 text-xs mt-2">
              Subscribe to our newsletter for updates and exclusive offers
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-8 mb-6">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label={label}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm border-t border-gray-800 pt-6">
          <p>&copy; {currentYear} Streamflix. All rights reserved.</p>
          <p className="mt-1">
            Powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E50914] hover:underline"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;