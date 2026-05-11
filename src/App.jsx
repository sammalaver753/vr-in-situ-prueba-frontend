import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="ml-4 text-xl font-semibold text-gray-700">Cargando...</p>
    </div>
  );

  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS --- */}
      {/* Si el usuario ya está logueado, lo mandamos al catálogo automáticamente */}
      <Route path="/login" element={user ? <Navigate to="/catalog" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/catalog" /> : <Register />} />

      {/* --- RUTAS PROTEGIDAS (Requieren estar logueado) --- */}
      <Route element={<ProtectedRoute />}>
        {/* Usamos un fragmento para que todas estas rutas tengan el Navbar arriba */}
        <Route 
          path="/catalog" 
          element={
            <>
              <Navbar />
              <Catalog />
            </>
          } 
        />

        {/* --- RUTAS DE ADMINISTRADOR (Requieren rol 'Admin') --- */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route 
            path="/admin" 
            element={
              <>
                <Navbar />
                <AdminDashboard />
              </>
            } 
          />
        </Route>
      </Route>

      {/* Redirección por defecto si la ruta no existe */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;