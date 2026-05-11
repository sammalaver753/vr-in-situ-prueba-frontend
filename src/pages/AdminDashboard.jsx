import { useState, useEffect, useCallback } from 'react';
import clientAxios from '../api/axios';
import useAuth from '../hooks/useAuth';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('catalog');
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        label: '',
        imageUrl: '',
        contentUrl: '',
        type: 'pelicula'
    });

    // 1. Carga de Ítems del catálogo
    const fetchItems = useCallback(async () => {
        try {
            const { data } = await clientAxios.get('/catalog?limit=100');
            setItems(data.items);
        } catch (err) {
            console.error("Error al cargar ítems", err);
        }
    }, []);

    // 2. Carga de Usuarios
    const fetchUsers = useCallback(async () => {
        try {
            const { data } = await clientAxios.get('/users');
            setUsers(data);
        } catch (err) {
            console.error("Error al cargar usuarios", err);
        }
    }, []);

    // Efecto para cargar datos según la pestaña activa
    useEffect(() => {
        const loadDashboardData = async () => {
            if (activeTab === 'catalog') {
                await fetchItems();
            } else {
                await fetchUsers();
            }
        };
        loadDashboardData();
    }, [activeTab, fetchItems, fetchUsers]);

    // --- ACCIONES DE CATÁLOGO ---

    const handleCreateItem = async (e) => {
        e.preventDefault();
        try {
            await clientAxios.post('/catalog', formData);
            alert('Contenido agregado con éxito');
            setFormData({ title: '', label: '', imageUrl: '', contentUrl: '', type: 'pelicula' });
            fetchItems();
        } catch (error) {
            alert(error.response?.data?.message || 'Error al crear');
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este ítem?')) {
            try {
                await clientAxios.delete(`/catalog/${id}`);
                fetchItems();
            } catch {
                alert('Error al eliminar');
            }
        }
    };

    // --- ACCIONES DE USUARIOS ---

    const handleUpdateRole = async (userId, currentRole) => {

        if (user && userId === user._id) {
        alert("No es posible realizar esta acción sobre tu propio usuario.");
        return;
    }
        const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
        if (window.confirm(`¿Seguro que quieres cambiar el rol a ${newRole}?`)) {
            try {
                await clientAxios.put(`/users/${userId}`, { role: newRole });
                fetchUsers();
            } catch {
                alert('Error al actualizar el rol');
            }
        }
    };

    const handleDeleteUser = async (userId) => {

        if (userId === user._id) {
        alert("No puedes eliminar tu propia cuenta administrativa.");
        return;
    }
        if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
            try {
                await clientAxios.delete(`/users/${userId}`);
                fetchUsers();
            } catch {
                alert('Error al eliminar usuario');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>

            {/* Selector de Pestañas */}
            <div className="flex border-b border-gray-300 mb-6">
                <button 
                    onClick={() => setActiveTab('catalog')}
                    className={`py-2 px-4 font-medium transition-colors ${activeTab === 'catalog' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-400'}`}
                >Gestión de Catálogo</button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`py-2 px-4 font-medium transition-colors ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-400'}`}
                >Gestión de Usuarios</button>
            </div>

            {activeTab === 'catalog' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario de Creación */}
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Agregar Nuevo Contenido</h2>
                        <form onSubmit={handleCreateItem} className="space-y-4">
                            <input 
                                type="text" placeholder="Título" required 
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                            <input 
                                type="text" placeholder="Etiqueta (ej: Acción, Drama)" required 
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.label}
                                onChange={(e) => setFormData({...formData, label: e.target.value})}
                            />
                            <input 
                                type="text" placeholder="URL de Imagen" required 
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                            />
                            <input 
                                type="text" placeholder="URL de YouTube" required 
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.contentUrl}
                                onChange={(e) => setFormData({...formData, contentUrl: e.target.value})}
                            />
                            <select 
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="pelicula">Película</option>
                                <option value="serie">Serie</option>
                            </select>
                            <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition-colors">
                                Guardar Contenido
                            </button>
                        </form>
                    </div>

                    {/* Tabla de Catálogo */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b text-gray-600 italic">
                                    <th className="py-2">Título</th>
                                    <th className="py-2">Tipo</th>
                                    <th className="py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 font-medium">{item.title}</td>
                                        <td className="py-3 uppercase text-xs font-bold text-gray-500">{item.type}</td>
                                        <td className="py-3 text-red-600">
                                            <button 
                                                onClick={() => handleDeleteItem(item._id)}
                                                className="hover:underline font-medium"
                                            >Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* TABLA DE GESTIÓN DE USUARIOS */
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Usuarios Registrados</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-gray-600 italic">
                                <th className="py-2">Nombre</th>
                                <th className="py-2">Email</th>
                                <th className="py-2">Rol</th>
                                <th className="py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="py-3 font-medium">{u.name}</td>
                                    <td className="py-3 text-gray-600">{u.email}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'Admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-3 flex gap-4">
                                        <button 
                                            onClick={() => handleUpdateRole(u._id, u.role)}
                                            className="text-blue-600 hover:underline text-sm font-bold"
                                        >Cambiar Rol</button>
                                        <button 
                                            onClick={() => handleDeleteUser(u._id)}
                                            className="text-red-600 hover:underline text-sm font-bold"
                                        >Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;