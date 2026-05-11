import axios from 'axios';

// Crear una instancia personalizada de Axios
const clientAxios = axios.create({
    baseURL: 'http://localhost:8001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para añadir el Token JWT a cada petición
clientAxios.interceptors.request.use(
    (config) => {
        // Buscamos el token en el localStorage (donde lo guardaremos al loguear)
        const token = localStorage.getItem('token');
        if (token) {
            // Añadimos el token Bearer 
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default clientAxios;