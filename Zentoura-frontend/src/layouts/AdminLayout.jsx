import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiHome, FiFileText, FiMapPin, FiActivity, FiLogOut, FiMenu, FiX, FiUsers, FiMessageSquare, FiCalendar
} from 'react-icons/fi';
import { FaHotel } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/admin/users', icon: FiUsers, label: 'Manage Users' },
        { path: '/admin/blogs', icon: FiFileText, label: 'Blogs' },
        { path: '/admin/hotels', icon: FaHotel, label: 'Hotels' },
        { path: '/admin/places', icon: FiMapPin, label: 'Places' },
        { path: '/admin/activities', icon: FiActivity, label: 'Activities' },
        { path: '/admin/activity-bookings', icon: FiCalendar, label: 'Activity Bookings' },
        { path: '/admin/messages', icon: FiMessageSquare, label: 'Messages' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Varients for sidebar animations
    const sidebarVariants = {
        open: { x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
        closed: { x: "-100%", transition: { type: "spring", stiffness: 100, damping: 20 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.1, duration: 0.3 }
        })
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <motion.aside
                initial="closed"
                animate={sidebarOpen ? "open" : "closed"}
                variants={sidebarVariants}
                className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-800 via-indigo-800 to-purple-900 shadow-2xl z-50 text-white"
            >
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold tracking-wider flex items-center gap-2">
                        <span className="text-purple-300">ZEN</span>TOURA
                    </h2>
                    <p className="text-xs text-purple-200/60 mt-1 uppercase tracking-widest pl-0.5">Admin Workspace</p>
                </div>

                <nav className="px-4 space-y-2 mt-6">
                    {menuItems.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10'
                                        : 'text-purple-100/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-200' : ''}`} />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute right-2 w-1.5 h-1.5 bg-purple-300 rounded-full"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t border-white/10 bg-black/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-white transition-all"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {/* Top Bar */}
                <div className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                            {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                            {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs ring-2 ring-purple-50 ring-offset-2">
                            A
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
