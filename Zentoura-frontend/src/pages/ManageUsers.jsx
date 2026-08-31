import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { FiTrash2, FiUser, FiMail, FiCalendar } from 'react-icons/fi';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/users');
            setUsers(response.data.data || []);
        } catch (error) {
            toast.error('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axios.delete(`/users/${id}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Error deleting user');
                console.error(error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Users</h1>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium">
                    Total Users: {users.length}
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-white/50 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zentoura-calm/50 border-b border-zentoura-deep/5">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">User</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Email</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Role</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zentoura-deep/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zentoura-deep/5">
                            {users.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-zentoura-calm/10 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                                                {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                                            </div>
                                            <span className="font-bold text-zentoura-deepest">{user.name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <FiMail className="text-gray-400" />
                                            <span>{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-[10px] rounded-full font-black uppercase tracking-widest ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-600'
                                            : 'bg-green-100 text-green-600'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zentoura-deep/60 text-xs font-medium">
                                        <div className="flex items-center space-x-2">
                                            <FiCalendar className="text-gray-400" />
                                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete User"
                                            disabled={user.role === 'admin'} // Prevent deleting other admins for safety if needed, or remove check
                                        >
                                            <FiTrash2 className={`w-5 h-5 ${user.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                            {users.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-zentoura-deep/30 italic">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
