import { useState, useEffect, useRef } from 'react';
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
  const [sources, setSources] = useState(['all']);
  const [selectedSource, setSelectedSource] = useState('all');
  const debounceTimer = useRef(null);

  useEffect(() => {
    loadCacheOnMount(); // Load cache saat pertama kali mount
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

        // Pakai cache jika masih fresh
        if (age < CACHE_DURATION && (!query || parsed.query === query)) {
          setNews(parsed.data);
          setSources(['all', ...new Set(parsed.data.map(item => item.source))]);
          return;
        }

        // Pakai cache fallback dan update data di background
        if (age < FALLBACK_CACHE_DURATION) {
          setNews(parsed.data);
          setSources(['all', ...new Set(parsed.data.map(item => item.source))]);
          setTimeout(() => loadNews(true), 100);
          return;
        }
      }

      // Jika tidak ada cache, load data baru
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

      // Cek cache sebelum fetch (kecuali untuk background update)
      if (!backgroundUpdate) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION && parsed.query === query) {
            setNews(parsed.data);
            setSources(['all', ...new Set(parsed.data.map(item => item.source))]);
            return;
          }
        }
      }

      // Fetch data terbaru dari API
      const data = await fetchNewsData(query);

      // Simpan data ke cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now(),
        query
      }));

      setNews(data);
      setSources(['all', ...new Set(data.map(item => item.source))]);
    } catch {
      // Jika error, coba gunakan cache fallback
      if (!backgroundUpdate) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < FALLBACK_CACHE_DURATION) {
            setNews(parsed.data);
            setSources(['all', ...new Set(parsed.data.map(item => item.source))]);
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

  // Filter berita berdasarkan sumber yang dipilih
  const filteredNews = selectedSource === 'all' ? news : news.filter(item => item.source === selectedSource);

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
