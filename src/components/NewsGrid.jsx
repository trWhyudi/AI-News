import NewsCard from './NewsCard';

const NewsGrid = ({ news, loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96" data-aos="fade-up">
        <div className="loading-spinner mb-4"></div>
        <p className="text-gray-500 text-lg">Loading AI news...</p>
        <p className="text-gray-400 text-sm mt-1">Curating the latest developments</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16" data-aos="fade-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 gradient-bg text-white rounded-full hover:shadow-custom-button transition-all duration-300 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-16" data-aos="fade-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We couldn't find any news matching your search. Try different keywords or browse all categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up">
      {news.map((article, index) => (
        <NewsCard 
          key={`${article.url}-${index}`} 
          article={article} 
          index={index}
        />
      ))}
    </div>
  );
};

export default NewsGrid;