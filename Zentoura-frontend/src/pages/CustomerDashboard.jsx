import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUser, FiCreditCard, FiClock, FiChevronRight } from 'react-icons/fi';
import axios from '../api/axios';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const CustomerDashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({
        totalBookings: 0,
        upcoming: 0,
        spent: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/bookings/my-bookings');
            const allBookings = response.data.data || [];

            const upcoming = allBookings.filter(b => b.status === 'Confirmed' && new Date(b.checkIn) >= new Date()).length;
            const spent = allBookings.filter(b => b.status === 'Confirmed').reduce((acc, b) => acc + parseFloat(b.totalPrice), 0);

            setBookings(allBookings.slice(0, 5)); // Show only latest 5
            setStats({
                totalBookings: allBookings.length,
                upcoming,
                spent: spent.toFixed(2)
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-zentoura-deepest">
                            {t('dashboard.welcomeBack')}, {user?.name.split(' ')[0]}!
                        </h1>
                        <p className="text-gray-500 mt-2">{t('dashboard.manageTravels')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/hotels"
                            className="px-6 py-3 bg-zentoura-deep text-white font-bold rounded-xl hover:bg-zentoura-deepest transition-all shadow-lg shadow-zentoura-deep/20"
                        >
                            {t('dashboard.findNewStays')}
                        </Link>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <FiCalendar className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">{t('dashboard.upcoming')}</span>
                                <h3 className="text-2xl font-bold text-zentoura-deepest">{stats.upcoming} {t('common.bookings')}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                                <FiCreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">{t('dashboard.totalSpent')}</span>
                                <h3 className="text-2xl font-bold text-zentoura-deepest">Rs. {stats.spent}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                                <FiClock className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">{t('dashboard.history')}</span>
                                <h3 className="text-2xl font-bold text-zentoura-deepest">{stats.totalBookings} {t('common.total')}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-zentoura-deepest">{t('dashboard.recentBookings')}</h2>
                        <Link to="/my-bookings" className="text-zentoura-primary font-bold flex items-center gap-1 hover:underline">
                            {t('dashboard.viewAll')} <FiChevronRight />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <div key={booking.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-zentoura-deep/5 text-zentoura-deep rounded-2xl flex items-center justify-center shrink-0">
                                            <FiCalendar className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-zentoura-deepest">{booking.hotel?.name}</h4>
                                            <p className="text-sm text-gray-500">{booking.room?.name} • {booking.checkIn} to {booking.checkOut}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-zentoura-primary">Rs. {booking.totalPrice}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest mt-1
                                            ${booking.status === 'Confirmed' ? 'text-green-500' : 'text-red-500'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <div className="text-center py-10">
                                    <p className="text-gray-400 italic">{t('dashboard.noBookings')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Settings Teaser */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-zentoura-deep to-zentoura-deepest rounded-[2rem] p-8 text-white shadow-xl shadow-zentoura-deep/20">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                            <FiUser className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{t('dashboard.personalInfo')}</h3>
                        <p className="text-white/70 mb-8">{t('dashboard.updateInfo')}</p>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-zentoura-yellow rounded-full"></span>
                                <span className="text-sm text-white/90">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-zentoura-yellow rounded-full"></span>
                                <span className="text-sm text-white/90">{t('dashboard.customerSince')} {new Date(user?.createdAt).getFullYear()}</span>
                            </div>
                        </div>
                        <Link
                            to="/profile"
                            className="inline-block px-6 py-3 bg-white text-zentoura-deepest font-bold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            {t('dashboard.manageProfile')}
                        </Link>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-zentoura-yellow/10 text-zentoura-yellow rounded-2xl flex items-center justify-center mb-6">
                                <FiMapPin className="w-6 h-6 font-bold" />
                            </div>
                            <h3 className="text-2xl font-bold text-zentoura-deepest mb-2">{t('dashboard.exploreMoreTitle')}</h3>
                            <p className="text-gray-500 leading-relaxed">{t('dashboard.exploreMoreDesc')}</p>
                        </div>
                        <div className="mt-8 flex gap-3">
                            <Link to="/places" className="flex-1 py-3 text-center bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">{t('dashboard.destinations')}</Link>
                            <Link to="/activities" className="flex-1 py-3 text-center bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">{t('activites')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
