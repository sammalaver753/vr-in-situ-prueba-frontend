import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../api/axios';

const AuthContext = createContext();

    const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Comprobar si hay un token al cargar la app

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Recuperamos los datos básicos guardados
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) setUser(storedUser);
            } catch (error) {
                console.error("Error recuperando sesión:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Función para Iniciar Sesión
    const login = async (email, password) => {
        try {
            const { data } = await clientAxios.post('/auth/login', { email, password });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ 
            _id: data._id || data.id,
            name: data.name, 
            role: data.role 
        }));
            
            setUser({ 
            _id: data._id || data.id,
            name: data.name, 
            role: data.role 
        });
            navigate('/catalog'); 
        } catch (error) {
            return Promise.reject(error);
        }
    };

    // Función para Cerrar Sesión
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
export default AuthContext;