import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSearch, FiUser, FiHome, FiTrendingUp, FiGrid, FiInfo, FiBookmark } from 'react-icons/fi';
import { AiOutlineRobot } from 'react-icons/ai';

const Navbar = ({ query, setQuery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(localQuery);
    }, 500);
    
    return () => clearTimeout(handler);
  }, [localQuery, setQuery]);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
    data-aos="fade-down">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div className="flex items-center">
              <div className="relative">
                <AiOutlineRobot className="text-primary text-2xl mr-2" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full"></div>
              </div>
              <span className="text-gray-800 font-bold text-xl">
                <span className="gradient-text">AI</span> News
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 border border-custom-border">
            <NavLink icon={<FiHome />} text="Home" active />
            <NavLink icon={<FiTrendingUp />} text="Trending" />
            <NavLink icon={<FiGrid />} text="Categories" />
            <NavLink icon={<FiBookmark />} text="Saved" />
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-600 hover:text-primary transition p-2 rounded-full hover:bg-custom-border"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shadow-custom-button">
              <FiUser size={18} />
            </div>
          </div>

          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden text-gray-700 ml-4 p-1 rounded-md hover:bg-custom-border"
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>
        </div>

        <div className={`transition-all duration-300 overflow-hidden px-2 ${searchOpen ? 'max-h-20 py-3' : 'max-h-0 py-0'}`}>
          <div className="relative">
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search AI news..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-custom-border focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 placeholder-gray-400 shadow-sm"
            />
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen opacity-100 bg-white py-4 shadow-lg' : 'max-h-0 opacity-0 py-0'}`}>
        <div className="container mx-auto px-4 pb-4">
          <nav className="flex flex-col space-y-2 pt-2">
            <MobileNavLink icon={<FiHome />} text="Home" active />
            <MobileNavLink icon={<FiTrendingUp />} text="Trending" />
            <MobileNavLink icon={<FiGrid />} text="Categories" />
            <MobileNavLink icon={<FiBookmark />} text="Saved" />
            <div className="pt-4 border-t border-custom-border">
              <MobileNavLink icon={<FiUser />} text="My Account" />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ icon, text, active = false }) => (
  <a
    href="#"
    className={`flex items-center px-4 py-2 rounded-full transition ${
      active 
        ? 'gradient-bg text-white shadow-custom-button' 
        : 'text-gray-600 hover:text-primary hover:bg-custom-border'
    }`}
  >
    <span className="mr-2">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </a>
);

const MobileNavLink = ({ icon, text, active = false }) => (
  <a
    href="#"
    className={`flex items-center px-4 py-3 rounded-lg transition ${
      active 
        ? 'gradient-bg text-white shadow-custom-button' 
        : 'text-gray-700 hover:bg-custom-border'
    }`}
  >
    <span className="mr-3 text-lg">{icon}</span>
    <span className="font-medium">{text}</span>
  </a>
);

export default Navbar;