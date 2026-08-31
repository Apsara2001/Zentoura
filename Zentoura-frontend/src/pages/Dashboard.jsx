import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { FiFileText, FiMapPin, FiActivity, FiUsers } from 'react-icons/fi';
import { FaHotel, FaRupeeSign } from 'react-icons/fa';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        blogs: 0,
        hotels: 0,
        places: 0,
        activities: 0,
        users: 0
    });
    const [graphData, setGraphData] = useState({
        hotelBookings: [],
        activityBookings: [],
        userRegistrations: [],
        revenue: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchGraphData();
    }, []);

    const fetchStats = async () => {
        try {
            const [blogs, hotels, places, activities, users] = await Promise.all([
                axios.get('/blogs'),
                axios.get('/hotels'),
                axios.get('/places'),
                axios.get('/activities'),
                axios.get('/users'),
            ]);
            setStats({
                blogs: blogs.data.count || 0,
                hotels: hotels.data.count || 0,
                places: places.data.count || 0,
                activities: activities.data.count || 0,
                users: users.data.count || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // toast.error('Failed to load dashboard metrics');
        }
    };

    const fetchGraphData = async () => {
        try {
            const response = await axios.get('/admin/dashboard-stats');
            setGraphData(response.data.data);
        } catch (error) {
            console.error('Error fetching graph data:', error);
            toast.error('Failed to load graph data');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { icon: FiUsers, label: 'Total Users', value: stats.users, color: 'from-pink-500 to-pink-600' },
        { icon: FiFileText, label: 'Total Blogs', value: stats.blogs, color: 'from-blue-500 to-blue-600' },
        { icon: FaHotel, label: 'Total Hotels', value: stats.hotels, color: 'from-green-500 to-green-600' },
        { icon: FiMapPin, label: 'Total Places', value: stats.places, color: 'from-purple-500 to-purple-600' },
        { icon: FiActivity, label: 'Total Activities', value: stats.activities, color: 'from-orange-500 to-orange-600' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 rounded-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Hotel Bookings Trend */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FaHotel className="text-emerald-400" /> Hotel Bookings (Last 7 Days)
                    </h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={graphData.hotelBookings}>
                                <defs>
                                    <linearGradient id="colorHotel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6EE7B7" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6EE7B7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })} stroke="#9CA3AF" />
                                <YAxis allowDecimals={false} stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Area type="monotone" dataKey="value" stroke="#34D399" fillOpacity={1} fill="url(#colorHotel)" name="Bookings" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 2. Activity Bookings Trend */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FiActivity className="text-orange-400" /> Activity Bookings (Last 7 Days)
                    </h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={graphData.activityBookings}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })} stroke="#9CA3AF" />
                                <YAxis allowDecimals={false} stroke="#9CA3AF" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Bar dataKey="value" fill="#FDBA74" radius={[4, 4, 0, 0]} name="Bookings" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 3. User Registration Trend */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FiUsers className="text-blue-400" /> New Users (Last 7 Days)
                    </h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData.userRegistrations}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })} stroke="#9CA3AF" />
                                <YAxis allowDecimals={false} stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Line type="monotone" dataKey="value" stroke="#93C5FD" strokeWidth={3} dot={{ r: 4, fill: '#60A5FA' }} activeDot={{ r: 8 }} name="Users" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 4. Revenue Trend */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-purple-400 font-bold text-xl">Rs</span> Revenue & Earnings (Last 7 Days)
                    </h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={graphData.revenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C4B5FD" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })} stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#A78BFA" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
