import { useEffect, useState } from 'react';
import clientAxios from '../api/axios';
import MovieCard from '../components/MovieCard';

const Catalog = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Definimos la función dentro para que React sepa que es local al efecto
        const getData = async () => { 
            setLoading(true); 
            try {
                const { data } = await clientAxios.get(`/catalog?type=${type}&page=${page}&limit=8`);
                setItems(data.items);
                setTotalPages(data.pages);
            } catch (error) {
                console.error("Error al cargar el catálogo", error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [type, page]);

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="max-w-7xl mx-auto p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Explorar Catálogo</h2>
                    
                    {/* Filtros */}
                    <div className="flex gap-2">
                        <button 
                            onClick={() => { setType(''); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm ${type === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >Todos</button>
                        <button 
                            onClick={() => { setType('pelicula'); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm ${type === 'pelicula' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >Películas</button>
                        <button 
                            onClick={() => { setType('serie'); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm ${type === 'serie' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >Series</button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Cargando contenido...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {items.map(item => <MovieCard key={item._id} item={item} />)}
                        </div>

                        {/* Paginación */}
                        <div className="flex justify-center mt-12 gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`px-4 py-2 border rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Catalog;