const MovieCard = ({ item }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img 
                src={item.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
                alt={item.title} 
                className="w-full h-64 object-cover"
            />
            <div className="p-4">
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${item.type === 'pelicula' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {item.type}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.label}</p>
                <a 
                    href={item.contentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 block text-center bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    Ver en YouTube
                </a>
            </div>
        </div>
    );
};

export default MovieCard;