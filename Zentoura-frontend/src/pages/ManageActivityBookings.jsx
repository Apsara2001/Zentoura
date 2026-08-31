import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import { toast } from 'react-toastify';
import { FiCalendar, FiUser, FiActivity, FiArrowRight, FiCheckCircle, FiXCircle, FiClock, FiSearch, FiFilter } from 'react-icons/fi';

const ManageActivityBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/activity-bookings');
            setBookings(response.data.data || []);
        } catch (error) {
            toast.error('Error fetching bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.patch(`/activity-bookings/${id}/status`, { status: newStatus });
            toast.success(`Booking marked as ${newStatus}`);
            fetchBookings();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.activity?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusColors = {
        Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <FiClock />;
            case 'Confirmed': return <FiCheckCircle />;
            case 'Cancelled': return <FiXCircle />;
            case 'Completed': return <FiCheckCircle />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-white dark:border-gray-800">
                <div>
                    <h1 className="text-4xl font-black text-zentoura-deepest dark:text-white flex items-center gap-3">
                        <FiCalendar className="text-zentoura-primary" /> Activity Ledger
                    </h1>
                    <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-xs">Audit and manage global activity bookings</p>
                </div>
                <div className="flex items-center gap-2 bg-zentoura-calm dark:bg-gray-800 px-6 py-3 rounded-2xl border border-zentoura-primary/10">
                    <span className="text-zentoura-primary font-black text-xl">{filteredBookings.length}</span>
                    <span className="text-gray-400 text-xs font-black uppercase tracking-wider">Total Orders</span>
                </div>
            </div>

            {/* Controls Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 relative">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by user or activity name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 p-6 pl-16 rounded-3xl shadow-lg border border-transparent focus:border-zentoura-primary outline-none font-bold transition-all"
                    />
                </div>
                <div className="lg:col-span-4 relative">
                    <FiFilter className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 p-6 pl-16 rounded-3xl shadow-lg border border-transparent focus:border-zentoura-primary outline-none font-bold appearance-none transition-all cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl border border-white dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Order & Date</th>
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Traveler</th>
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Experience</th>
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-10 py-8"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-xl w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="space-y-1">
                                                <p className="font-black text-zentoura-deepest dark:text-white">ORD-{booking.id.toString().padStart(5, '0')}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                                    <FiClock className="w-3 h-3" /> {new Date(booking.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-zentoura-primary/10 flex items-center justify-center font-black text-zentoura-primary text-sm shadow-inner">
                                                    {booking.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zentoura-deepest dark:text-white capitalize leading-tight">{booking.user?.name || 'Guest Explorer'}</p>
                                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider">{booking.user?.email || 'No Email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border-2 border-white dark:border-gray-700 flex-shrink-0">
                                                    <img
                                                        src={booking.activity?.image ? (booking.activity.image.startsWith('http') ? booking.activity.image : `${IMAGE_BASE_URL}/${booking.activity.image}`) : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=140'}
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-black text-zentoura-deepest dark:text-white text-sm">{booking.activity?.name}</p>
                                                    <p className="text-zentoura-primary text-[10px] font-black uppercase tracking-widest">Rs. {booking.totalPrice?.toLocaleString()} • {booking.guests} Guests</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${statusColors[booking.status]}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {booking.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                                                        className="p-3 text-green-500 bg-green-50 dark:bg-green-900/10 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-sm"
                                                        title="Confirm Booking"
                                                    >
                                                        <FiCheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {booking.status === 'Confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                                                        className="p-3 text-blue-500 bg-blue-50 dark:bg-blue-900/10 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-sm"
                                                        title="Mark Completed"
                                                    >
                                                        <FiArrowRight className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                                                        className="p-3 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-sm"
                                                        title="Cancel Order"
                                                    >
                                                        <FiXCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 py-10 opacity-30">
                                            <FiCalendar className="w-20 h-20 text-gray-300" />
                                            <p className="font-black uppercase tracking-[0.3em] text-sm text-gray-500">No matching activities found</p>
                                        </div>
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

export default ManageActivityBookings;
