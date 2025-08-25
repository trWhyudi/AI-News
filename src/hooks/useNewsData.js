import { useState, useEffect, useRef, useMemo } from 'react';
import { fetchNewsData } from '../services/newsApi';

const CACHE_KEY = 'cachedNewsData';
const CACHE_DURATION = 5 * 60 * 1000; // Cache fresh 5 menit
const FALLBACK_CACHE_DURATION = 24 * 60 * 60 * 1000; // Cache fallback 24 jam

export const useNewsData = (initialQuery = '') => {
  // State utama: berita, loading, error, query, sumber berita, dan filter sumber
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery);
  const [sources, setSources] = useState(['All']);
  const [selectedSource, setSelectedSource] = useState('All');
  const debounceTimer = useRef(null);

  useEffect(() => {
    loadCacheOnMount();
  }, []);

  useEffect(() => {
    // Debounce query agar tidak request API terlalu sering
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => loadNews(), 500);
    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  // Load data dari cache localStorage
  const loadCacheOnMount = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;

        if (age < CACHE_DURATION && (!query || parsed.query === query)) {
          setNews(parsed.data);
          setSources(['All', ...new Set(parsed.data.map(item => item.source))]);
          return;
        }

        if (age < FALLBACK_CACHE_DURATION) {
          setNews(parsed.data);
          setSources(['All', ...new Set(parsed.data.map(item => item.source))]);
          setTimeout(() => loadNews(true), 100);
          return;
        }
      }

      if (!query || query === initialQuery) loadNews();
    } catch {
      loadNews();
    }
  };

  // Fetch data berita, dengan opsi background update tanpa loading spinner
  const loadNews = async (backgroundUpdate = false) => {
    try {
      if (!backgroundUpdate) setLoading(true);
      setError(null);

      if (!backgroundUpdate) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION && parsed.query === query) {
            setNews(parsed.data);
            setSources(['All', ...new Set(parsed.data.map(item => item.source))]);
            return;
          }
        }
      }

      const data = await fetchNewsData(query);

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now(),
        query
      }));

      setNews(data);
      setSources(['All', ...new Set(data.map(item => item.source))]);
    } catch {
      if (!backgroundUpdate) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < FALLBACK_CACHE_DURATION) {
            setNews(parsed.data);
            setSources(['All', ...new Set(parsed.data.map(item => item.source))]);
            setError('Using cached data. Unable to fetch latest news.');
            return;
          }
        }
      }
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter berita berdasarkan query dan sumber
  const filteredNews = useMemo(() => {
    let filtered = news;
    
    // Filter berdasarkan sumber
    if (selectedSource !== 'All') {
      filtered = filtered.filter(item => item.source === selectedSource);
    }
    
    // Filter berdasarkan query pencarian
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      filtered = filtered.filter(item => {
        return (
          item.title?.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.source?.toLowerCase().includes(searchTerm) ||
          item.author?.toLowerCase().includes(searchTerm)
        );
      });
    }
    
    return filtered;
  }, [news, selectedSource, query]);

  return {
    news: filteredNews,
    loading,
    error,
    query,
    setQuery,
    sources,
    selectedSource,
    setSelectedSource
  };
};