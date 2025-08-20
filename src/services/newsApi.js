import axios from 'axios';

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_KEY;
const NYT_API_KEY = import.meta.env.VITE_NYT_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_KEY;

// Request cache untuk mencegah duplicate request
const requestCache = new Map();
const MEMORY_CACHE_DURATION = 30 * 1000;

export const fetchNewsData = async (
  query = 'AI OR "artificial intelligence" OR "machine learning" OR "Deep Learning"',
  signal = null
) => {
  const searchQuery = query.trim() || '("artificial intelligence" OR "machine learning" OR "AI" OR "Deep Learning")';
  
  // Check memory cache untuk mencegah duplicate request
  const cacheKey = `news_${btoa(searchQuery)}`;
  const cached = requestCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_DURATION) {
    return cached.data;
  }

  try {
    const results = await Promise.allSettled([
      fetchGuardian(searchQuery, signal),
      fetchNYT(searchQuery, signal),
      fetchGNews(searchQuery, signal)
    ]);

    const allArticles = [
      ...normalizeGuardian(results[0]),
      ...normalizeNYT(results[1]),
      ...normalizeGNews(results[2])
    ];

    const uniqueArticles = allArticles.filter(
      (article, index, self) =>
        article.title &&
        article.url &&
        index === self.findIndex(a => a.url === article.url)
    );

    const sortedArticles = uniqueArticles.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    // Cache hasil di memory
    requestCache.set(cacheKey, {
      data: sortedArticles,
      timestamp: Date.now()
    });

    cleanupMemoryCache();

    return sortedArticles;
  } catch (error) {
    requestCache.delete(cacheKey);
    throw error;
  }
};

// Cleanup memory cache
const cleanupMemoryCache = () => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > MEMORY_CACHE_DURATION * 2) {
      requestCache.delete(key);
    }
  }
};

// API Fetch Functions
const fetchGuardian = async (query, signal) => {
  if (!GUARDIAN_API_KEY) return [];

  try {
    const res = await axios.get('https://content.guardianapis.com/search', {
      params: {
        q: `${query} AND (technology OR AI OR "artificial intelligence")`,
        'api-key': GUARDIAN_API_KEY,
        'show-fields': 'thumbnail,trailText,byline',
        'page-size': 50,
        'order-by': 'newest'
      },
      timeout: 10000,
      signal
    });

    return res.data.response.results || [];
  } catch (err) {
    if (err.name === 'AbortError' || err.name === 'CanceledError') {
      throw err;
    }
    console.error('Guardian API error:', err.message);
    return [];
  }
};

const fetchNYT = async (query, signal) => {
  if (!NYT_API_KEY) return [];

  try {
    const res = await axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
      params: {
        q: query,
        'api-key': NYT_API_KEY,
        'fl': 'web_url,headline,snippet,pub_date,byline,multimedia',
        'sort': 'newest'
      },
      timeout: 10000,
      signal
    });

    return res.data.response.docs || [];
  } catch (err) {
    if (err.name === 'AbortError' || err.name === 'CanceledError') {
      throw err;
    }
    console.error('NYT API error:', err.message);
    return [];
  }
};

const fetchGNews = async (query, signal) => {
  if (!GNEWS_API_KEY) return [];

  try {
    const res = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: query,
        lang: 'en',
        country: 'us',
        max: 20,
        sortby: 'publishedAt',
        apikey: GNEWS_API_KEY
      },
      timeout: 8000,
      signal
    });

    return res.data.articles || [];
  } catch (err) {
    if (err.name === 'AbortError' || err.name === 'CanceledError') {
      throw err;
    }
    
    console.error('GNews API error:', err.message);

    if ([403, 429].includes(err.response?.status)) {
      try {
        const fallback = await axios.get('https://gnews.io/api/v4/top-headlines', {
          params: {
            lang: 'en',
            country: 'us',
            max: 10,
            category: 'technology',
            apikey: GNEWS_API_KEY
          },
          timeout: 8000,
          signal
        });
        return fallback.data.articles || [];
      } catch (fallbackError) {
        if (fallbackError.name === 'AbortError' || fallbackError.name === 'CanceledError') {
          throw fallbackError;
        }
        console.error('GNews fallback error:', fallbackError.message);
      }
    }

    return [];
  }
};

// Normalizers
const normalizeGuardian = (result) => {
  if (result.status !== 'fulfilled' || !Array.isArray(result.value)) return [];
  return result.value.map(article => ({
    title: article.webTitle,
    url: article.webUrl,
    description: article.fields?.trailText || article.webTitle,
    source: 'The Guardian',
    publishedAt: article.webPublicationDate,
    imageUrl: article.fields?.thumbnail || null,
    author: article.fields?.byline || null
  }));
};

const normalizeNYT = (result) => {
  if (result.status !== 'fulfilled' || !Array.isArray(result.value)) return [];

  return result.value.map(article => {
    let imageUrl = null;
    if (Array.isArray(article.multimedia)) {
      const media = article.multimedia.find(m =>
        ['xlarge', 'articleLarge', 'thumbLarge'].includes(m.subtype)
      ) || article.multimedia[0];

      if (media?.url) {
        imageUrl = media.url.startsWith('http')
          ? media.url
          : media.url.startsWith('images/')
          ? `https://static01.nyt.com/${media.url}`
          : `https://www.nytimes.com/${media.url}`;
      }
    }

    return {
      title: article.headline?.main || '',
      url: article.web_url,
      description: article.snippet || '',
      source: 'New York Times',
      publishedAt: article.pub_date,
      imageUrl,
      author: article.byline?.original?.replace('By ', '') || null
    };
  });
};

const normalizeGNews = (result) => {
  if (result.status !== 'fulfilled' || !Array.isArray(result.value)) return [];
  return result.value.map(article => ({
    title: article.title,
    url: article.url,
    description: article.description || article.content || '',
    source: article.source?.name || 'GNews',
    publishedAt: article.publishedAt,
    imageUrl: article.image || null,
    author: article.source?.name || null
  }));
};