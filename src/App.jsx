import { useEffect } from 'react';
import { useNewsData } from './hooks/useNewsData';
import SearchBar from './components/SearchBar';
import SourceFilter from './components/SourceFilter';
import NewsGrid from './components/NewsGrid';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const { 
    news, 
    loading, 
    error, 
    query, 
    setQuery, 
    sources, 
    selectedSource, 
    setSelectedSource 
  } = useNewsData();

  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-bg to-white">
      <Navbar query={query} setQuery={setQuery} />
      
      <main className="container mx-auto px-4 pt-28 pb-8">
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Latest <span className="gradient-text">AI</span> News
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Stay updated with the latest developments in Artificial Intelligence from trusted sources worldwide
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-10" data-aos="fade-up" data-aos-delay="100">
          <SearchBar query={query} setQuery={setQuery} />
        </div>
        
        {sources.length > 1 && (
          <div className="mb-8" data-aos="fade-up" data-aos-delay="150">
            <SourceFilter 
              sources={sources} 
              selectedSource={selectedSource} 
              setSelectedSource={setSelectedSource} 
            />
          </div>
        )}
        
        <NewsGrid news={news} loading={loading} error={error} />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;