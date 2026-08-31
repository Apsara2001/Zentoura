import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiHome, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/bookings/my-bookings');
            setBookings(response.data.data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await axios.put(`/bookings/${id}/cancel`);
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            console.error('Cancellation failed:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-zentoura-deepest">My Journeys</h1>
                    <Link to="/hotels" className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                        Book New Stay
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🧳</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't booked any hotels yet. Start exploring our collection of luxury stays.</p>
                        <Link
                            to="/hotels"
                            className="inline-block px-8 py-3 bg-zentoura-deep text-white font-bold rounded-xl hover:bg-zentoura-deepest transition-colors shadow-lg shadow-zentoura-deep/20"
                        >
                            Explore Hotels
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start"
                            >
                                <div className="w-full md:w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                                    {booking.room?.image || booking.hotel?.image ? (
                                        <img
                                            src={(booking.room?.image || booking.hotel?.image).startsWith('http')
                                                ? (booking.room?.image || booking.hotel?.image)
                                                : `${IMAGE_BASE_URL}/${booking.room?.image || booking.hotel?.image}`}
                                            alt={booking.hotel?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <FiHome className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-zentoura-deepest">{booking.hotel?.name || 'Hotel'}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <FiMapPin /> {booking.hotel?.location || 'Unknown Location'}
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                                            ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`
                                        }>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-50">
                                        <div>
                                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Check In</span>
                                            <span className="font-medium text-gray-900">{booking.checkIn}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Check Out</span>
                                            <span className="font-medium text-gray-900">{booking.checkOut}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Room Type</span>
                                            <span className="font-medium text-gray-900">{booking.room?.name || 'Standard Room'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Rooms</span>
                                            <span className="font-medium text-gray-900">{booking.numRooms} Room{booking.numRooms > 1 && 's'}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="text-sm font-medium text-gray-500">
                                            Total Price: <span className="text-lg font-bold text-zentoura-primary ml-2">Rs. {booking.totalPrice}</span>
                                        </div>
                                        {booking.status === 'Confirmed' && new Date(booking.checkIn) > new Date() && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="text-sm text-red-500 font-bold hover:underline"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserBookings;
