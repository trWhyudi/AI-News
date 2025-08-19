const SourceFilter = ({ sources, selectedSource, setSelectedSource }) => {
  const handleSourceChange = (source) => {
    setSelectedSource(source === selectedSource ? '' : source);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-10" data-aos="fade-up" data-aos-delay="150">
      
      {sources.map((source) => (
        <button
          key={source}
          onClick={() => handleSourceChange(source)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
            selectedSource === source
              ? 'gradient-bg text-white shadow-custom-button border-transparent'
              : 'bg-white text-gray-700 hover:bg-custom-border border-custom-border shadow-sm'
          }`}
        >
          {source}
        </button>
      ))}
    </div>
  );
};

export default SourceFilter;