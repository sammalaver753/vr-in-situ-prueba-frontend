import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    // Mientras se verifica si hay un token en el localStorage
    if (loading) return <div className="p-10 text-center">Verificando sesión...</div>;

    // Si no hay usuario, mandarlo al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si la ruta requiere un rol específico (ej: Admin) y el usuario no lo tiene
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/catalog" replace />;
    }

    // Si todo está bien, renderiza el contenido de la ruta (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;