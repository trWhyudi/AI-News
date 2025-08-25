import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const NewsCard = ({ article }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
  <div className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300" data-aos="fade-up">
      {article.imageUrl && (
        <div className="aspect-video bg-gray-100 relative">
          {!isLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200 z-10" />
          )}
          <img 
            src={article.imageUrl}
            alt={article.title}
            loading="eager"
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.png';
              setIsLoaded(true);
            }}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="inline-block bg-light text-dark text-xs px-2 py-1 rounded mr-2">
            {article.source}
          </span>
          <span className="text-gray-500 text-sm">
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            {article.title}
          </a>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.description}
        </p>
        <div className="flex justify-between items-center">
          {article.author && (
            <span className="text-sm text-gray-500">
              By {article.author}
            </span>
          )}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary font-medium text-sm"
          >
            Read more →
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;