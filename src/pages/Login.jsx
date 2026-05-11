import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            // CORRECCIÓN LÓGICA: Accedemos al mensaje exacto de tu backend
            const mensajeBackend = err.response?.data?.message || 'Error de conexión';
            setError(mensajeBackend); 
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-blue-600 tracking-tighter border-b-4 border-blue-600 inline-block px-2 mb-2">
                    VR IN SITU
                </h1>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mt-2">
                    Películas y Series
                </p>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Iniciar Sesión
            </h2>

            {/* CORRECCIÓN VISUAL: Este bloque hace que el mensaje aparezca en la pantalla */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center text-sm font-bold">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        className="w-full mt-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input 
                        type="password" 
                        className="w-full mt-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
                >
                    Entrar al Sistema
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    </div>
    );
};

export default Login;