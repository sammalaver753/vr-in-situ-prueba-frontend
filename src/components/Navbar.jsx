import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b-2 border-blue-600">
            <div className="flex items-center gap-4">
                {/* Logo */}
                <Link to="/catalog" className="text-xl font-bold text-blue-600 border-2 border-blue-600 px-2 uppercase tracking-tighter">
                    VR In Situ
                </Link>
                
                <div className="flex gap-4 ml-4">
                    <Link 
                        to="/catalog" 
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold uppercase hover:bg-blue-700 transition-colors"
                    >
                        Catálogo
                    </Link>
                    
                    {/* Forzamos la visibilidad si el rol es Admin */}
                    {user?.role === 'Admin' && (
                        <Link 
                            to="/admin" 
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold uppercase hover:bg-blue-700 transition-colors"
                        >
                            Panel Admin
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Info del Admin */}
                <div className="text-right border-r pr-4 border-gray-300">
                    <p className="text-xs font-black text-blue-600 uppercase">{user?.role}</p>
                    <p className="text-sm text-gray-800 font-medium">{user?.name}</p>
                </div>

                <button 
                    onClick={logout}
                    className="text-red-600 hover:text-red-800 font-bold text-sm uppercase underline decoration-2"
                >
                    Salir
                </button>
            </div>
        </nav>
    );
};

export default Navbar;