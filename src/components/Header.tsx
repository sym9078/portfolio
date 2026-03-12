import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check admin status
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('adminToken') === 'admin-token-123');
    };
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAdmin);
    };
  }, [location.pathname]); // Re-check on route change

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'PROJECT', path: '/projects' },
    { name: 'WORK', path: '/work' },
    { name: 'PROFILE', path: '/profile' },
    { name: 'SKILLS', path: '/skills' },
    { name: 'PHILOSOPHY', path: '/philosophy' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'ADMIN', path: '/admin' });
  }

  // Secret admin access: double click logo
  const handleLogoDoubleClick = () => {
    navigate('/admin');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4 bg-zinc-950/90 backdrop-blur-sm' : 'py-8 bg-transparent'
        }`}
      >
        <div className="w-full px-6 md:px-12 flex items-center justify-between">
          <div 
            className="text-lg md:text-xl font-bold tracking-tight uppercase z-50 relative mix-blend-difference cursor-pointer"
            onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}
            onDoubleClick={handleLogoDoubleClick}
            title="Double click for Admin"
          >
            Shinyongmin<span className="font-light text-zinc-400">.Marketer</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-medium tracking-widest transition-all duration-300 hover:text-white ${
                  location.pathname === link.path 
                    ? 'text-white border-b border-white pb-1' 
                    : 'text-zinc-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-50 relative text-white mix-blend-difference"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-zinc-950 flex items-center justify-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-3xl font-light tracking-tighter ${
                    location.pathname === link.path 
                      ? 'text-white' 
                      : 'text-zinc-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
