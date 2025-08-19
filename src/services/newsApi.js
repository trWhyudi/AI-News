import axios from 'axios';

// Environment variables
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_KEY;
const NYT_API_KEY =  import.meta.env.VITE_NYT_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_KEY;

// Cache untuk menyimpan hasil request
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit cache

// Track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 detik antara request

export const fetchNewsData = async (query = 'AI OR "artificial intelligence" OR "machine learning" OR "Deep Learning"') => {
  try {
    const searchQuery = query.trim() === '' 
      ? '("artificial intelligence" OR "machine learning" OR "AI" OR "Deep Learning")' 
      : query;
    
    // Cek cache
    const cacheKey = `news-${searchQuery}`;
    const cachedData = requestCache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
      console.log('Using cached data');
      return cachedData.data;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => 
        setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }
    
    lastRequestTime = Date.now();

    // Fetch from multiple APIs in parallel with error handling
    const results = await Promise.allSettled([
      fetchGuardian(searchQuery),
      fetchNYT(searchQuery),
      fetchGNews(searchQuery)
    ]);

    // Extract successful results
    const [guardianResult, nytResult, gnewsResult] = results;

    // Combine and normalize data
    const combinedNews = [
      ...normalizeGuardian(guardianResult.status === 'fulfilled' ? guardianResult.value : []),
      ...normalizeNYT(nytResult.status === 'fulfilled' ? nytResult.value : []),
      ...normalizeGNews(gnewsResult.status === 'fulfilled' ? gnewsResult.value : [])
    ];

    // Remove duplicates based on URL and sort by date (newest first)
    const uniqueNews = combinedNews.filter((article, index, self) => 
      article.title && article.url && 
      index === self.findIndex(a => a.url === article.url)
    );

    const sortedNews = uniqueNews.sort((a, b) => 
      new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    // Simpan ke cache
    requestCache.set(cacheKey, {
      data: sortedNews,
      timestamp: Date.now()
    });

    console.log(`Fetched ${sortedNews.length} articles from APIs`);
    return sortedNews;
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Return cached data if available
    const allCachedData = Array.from(requestCache.values());
    if (allCachedData.length > 0) {
      const latestCache = allCachedData.sort((a, b) => b.timestamp - a.timestamp)[0];
      console.log('Using fallback cached data');
      return latestCache.data;
    }
    
    return [];
  }
};

// Fetch dari Guardian API (prioritas utama)
const fetchGuardian = async (query) => {
  if (!GUARDIAN_API_KEY) {
    console.warn('Guardian API key not configured');
    return [];
  }

  try {
    const response = await axios.get('https://content.guardianapis.com/search', {
      params: {
        q: `${query} AND (technology OR AI OR "artificial intelligence")`,
        'api-key': GUARDIAN_API_KEY,
        'show-fields': 'thumbnail,trailText,byline',
        'page-size': 50,
        'order-by': 'newest'
      },
      timeout: 10000
    });
    
    console.log('Guardian API success:', response.data.response.results?.length || 0, 'articles');
    return response.data.response.results || [];
  } catch (error) {
    console.error('Guardian API error:', error.message);
    return [];
  }
};

const fetchNYT = async (query) => {
  if (!NYT_API_KEY) {
    console.warn('NYT API key not configured');
    return [];
  }

  try {
    const response = await axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
      params: {
        q: query,
        'api-key': NYT_API_KEY,
        'fl': 'web_url,headline,snippet,pub_date,byline,multimedia'
      },
      timeout: 10000
    });
    
    console.log('NYT API success:', response.data.response.docs?.length || 0, 'articles');
    return response.data.response.docs || [];
  } catch (error) {
    console.error('NYT API error:', error.message);
    return [];
  }
};

const fetchGNews = async (query) => {
  if (!GNEWS_API_KEY) {
    console.warn('GNews API key not configured');
    return [];
  }

  try {
    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: query,
        lang: 'en',
        country: 'us',
        max: 20,
        apikey: GNEWS_API_KEY
      },
      timeout: 8000
    });
    
    console.log('GNews API success:', response.data.articles?.length || 0, 'articles');
    return response.data.articles || [];
  } catch (error) {
    console.error('GNews API error:', error.response?.status, error.message);
    
    // Fallback ke top-headlines jika search gagal
    if (error.response?.status === 403 || error.response?.status === 429) {
      try {
        console.log('Trying GNews top-headlines fallback...');
        const fallbackResponse = await axios.get('https://gnews.io/api/v4/top-headlines', {
          params: {
            lang: 'en',
            country: 'us',
            max: 10,
            apikey: GNEWS_API_KEY
          },
          timeout: 8000
        });
        return fallbackResponse.data.articles || [];
      } catch (fallbackError) {
        console.error('GNews fallback also failed:', fallbackError.message);
      }
    }
    
    return [];
  }
};

// Normalization functions
const normalizeGuardian = (articles) => {
  if (!Array.isArray(articles)) return [];
  return articles
    .filter(article => article && article.webTitle && article.webUrl)
    .map(article => ({
      title: article.webTitle,
      url: article.webUrl,
      description: article.fields?.trailText || article.webTitle,
      source: 'The Guardian',
      publishedAt: article.webPublicationDate,
      imageUrl: article.fields?.thumbnail || null,
      author: article.fields?.byline || null
    }));
};

// FIXED: NYT Images dengan proper URL construction
const normalizeNYT = (articles) => {
  if (!Array.isArray(articles)) return [];
  return articles
    .filter(article => article && article.headline?.main && article.web_url)
    .map(article => {
      // Fix NYT image URL construction
      let imageUrl = null;
      
      if (article.multimedia && article.multimedia.length > 0) {
        // Cari image dengan format yang sesuai
        const image = article.multimedia.find(media => 
          media.subtype === 'xlarge' || 
          media.subtype === 'articleLarge' || 
          media.subtype === 'thumbLarge' ||
          media.type === 'image'
        ) || article.multimedia[0];
        
        if (image && image.url) {
          // Construct proper NYT image URL
          if (image.url.startsWith('images/')) {
            imageUrl = `https://static01.nyt.com/${image.url}`;
          } else if (image.url.startsWith('http')) {
            imageUrl = image.url;
          } else {
            imageUrl = `https://www.nytimes.com/${image.url}`;
          }
        }
      }
      
      return {
        title: article.headline.main,
        url: article.web_url,
        description: article.snippet || article.lead_paragraph || '',
        source: 'New York Times',
        publishedAt: article.pub_date,
        imageUrl: imageUrl,
        author: article.byline?.original?.replace('By ', '') || null
      };
    });
};

const normalizeGNews = (articles) => {
  if (!Array.isArray(articles)) return [];
  return articles
    .filter(article => article && article.title && article.url)
    .map(article => ({
      title: article.title,
      url: article.url,
      description: article.description || article.content || '',
      source: article.source?.name || 'GNews',
      publishedAt: article.publishedAt,
      imageUrl: article.image || null,
      author: article.source?.name || null
    }));
};