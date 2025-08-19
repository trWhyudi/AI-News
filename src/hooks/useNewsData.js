import { useState, useEffect, useRef } from 'react';
import { fetchNewsData } from '../services/newsApi';

export const useNewsData = (initialQuery = '') => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery);
  const [sources, setSources] = useState(['all']);
  const [selectedSource, setSelectedSource] = useState('all');
  const debounceTimer = useRef(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchQuery = query;
        const data = await fetchNewsData(searchQuery);
        
        setNews(data);
        
        const uniqueSources = [...new Set(data.map(item => item.source))];
        setSources(['all', ...uniqueSources]);
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce untuk menghindari request terlalu sering saat mengetik
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      loadNews();
    }, 500);
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const filteredNews = selectedSource === 'all' 
    ? news 
    : news.filter(item => item.source === selectedSource);

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