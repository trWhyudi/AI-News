import { FiSearch, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const SearchBar = ({ query, setQuery }) => {
  const [localQuery, setLocalQuery] = useState(query);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTyping) {
        setQuery(localQuery);
        setIsTyping(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery, isTyping, setQuery]);

  const handleChange = (e) => {
    setLocalQuery(e.target.value);
    setIsTyping(true);
  };

  const clearSearch = () => {
    setLocalQuery('');
    setQuery('');
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
      <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${isFocused ? 'text-primary' : 'text-gray-400'}`}>
        <FiSearch size={20} />
      </div>
      <input
        type="text"
        value={localQuery}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search AI news, trends, and breakthroughs..."
        className="block w-full pl-12 pr-12 py-4 border border-custom-border rounded-full bg-white shadow-custom-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
      />
      {localQuery && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <FiX size={20} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;