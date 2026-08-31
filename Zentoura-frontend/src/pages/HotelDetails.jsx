import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiStar, FiWifi, FiCheck, FiUsers, FiMaximize, FiCalendar, FiMessageSquare, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

import { useTranslation } from 'react-i18next';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [selectedRoom, setSelectedRoom] = useState(null);
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().getTime() + 86400000).toISOString().split('T')[0];

    const [bookingData, setBookingData] = useState({
        checkIn: today,
        checkOut: tomorrow,
        guests: 1,
        numRooms: 1,
        paymentMethod: 'credit',
        cardType: 'visa',
        cardNumber: '',
        expiryDate: '',
        cvc: ''
    });

    const [showReviews, setShowReviews] = useState(false);

    // Backend handles translation now
    const name = hotel?.name;
    const location = hotel?.location;
    const { translatedText: description } = useDynamicTranslation(hotel?.description);

    const calculateNights = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 0;
        const start = new Date(bookingData.checkIn);
        const end = new Date(bookingData.checkOut);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    };

    const nights = calculateNights();
    const totalPrice = selectedRoom ? (nights * selectedRoom.pricePerNight * bookingData.numRooms) : 0;

    const [showBookingModal, setShowBookingModal] = useState(false);

    const { i18n } = useTranslation();

    useEffect(() => {
        fetchHotelDetails();
        fetchReviews();
    }, [id, bookingData.checkIn, bookingData.checkOut, i18n.language]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/reviews/hotel/${id}`);
            setReviews(response.data.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const fetchHotelDetails = async () => {
        try {
            setLoading(true);
            const params = {};
            if (bookingData.checkIn && bookingData.checkOut) {
                params.checkIn = bookingData.checkIn;
                params.checkOut = bookingData.checkOut;
            }
            const response = await axios.get(`/hotels/${id}`, { params });
            const data = response.data.data;

            // Defensive parsing for amenities
            if (data && typeof data.amenities === 'string') {
                try {
                    data.amenities = JSON.parse(data.amenities);
                } catch (e) {
                    data.amenities = [];
                }
            }

            if (data && data.rooms) {
                data.rooms = data.rooms.map(room => {
                    if (typeof room.amenities === 'string') {
                        try {
                            room.amenities = JSON.parse(room.amenities);
                        } catch (e) {
                            room.amenities = [];
                        }
                    }
                    return room;
                });
            }

            setHotel(data);
        } catch (error) {
            console.error('Error fetching hotel details:', error);
            toast.error(t('common.failedToLoadHotel'));
        } finally {
            setLoading(false);
        }
    };

    const handleBookClick = (room = null) => {
        if (!user) {
            toast.error(t('common.pleaseLoginToBook'));
            navigate('/login', { state: { from: `/hotels/${id}` } });
            return;
        }
        setSelectedRoom(room);
        setShowBookingModal(true);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (!selectedRoom) {
            toast.error('Please select a room type');
            return;
        }

        try {
            // Calculate total price based on nights
            const start = new Date(bookingData.checkIn);
            const end = new Date(bookingData.checkOut);
            const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            if (nights <= 0) {
                toast.error('Invalid dates selected');
                return;
            }

            const totalPrice = nights * selectedRoom.pricePerNight;

            toast.info("Working right now...", {
                position: "top-center",
                autoClose: 2000,
            });

            await axios.post('/bookings', {
                hotelId: parseInt(id),
                roomId: selectedRoom.id,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                guests: parseInt(bookingData.guests),
                numRooms: parseInt(bookingData.numRooms),
                paymentMethod: bookingData.paymentMethod,
                cardType: bookingData.cardType,
                cardNumber: bookingData.cardNumber,
                expiryDate: bookingData.expiryDate,
                cvc: bookingData.cvc
            });

            toast.success(t('common.bookingConfirmed'), {
                position: "top-center",
                autoClose: 5000,
            });
            setShowBookingModal(false);
            navigate('/dashboard');
        } catch (error) {
            console.error('Booking failed:', error);
            toast.error(error.response?.data?.message || t('common.bookingFailed'));
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error(t('common.pleaseLoginToReview'));
            return;
        }

        try {
            setSubmittingReview(true);
            const response = await axios.post('/reviews', {
                hotelId: parseInt(id),
                rating: newReview.rating,
                comment: newReview.comment
            });

            toast.success(t('common.reviewSubmitted'));
            setReviews([response.data.data, ...reviews]);
            setNewReview({ rating: 5, comment: '' });

            // Refresh hotel details to get new average rating
            fetchHotelDetails();
        } catch (error) {
            console.error('Review submission failed:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <Loader />;
    if (!hotel) return <div className="text-center py-20 font-bold text-zentoura-deep">{t('hotels.notFound')}</div>;

    const imageUrl = hotel.image
        ? (hotel.image.startsWith('http') ? hotel.image : `${IMAGE_BASE_URL}/${hotel.image}`)
        : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img
                    src={imageUrl}
                    className="w-full h-full object-cover"
                    alt={hotel.name}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                            {name}
                        </h1>
                        <div className="flex items-center gap-4 text-lg">
                            <span className="flex items-center gap-1"><FiMapPin className="text-zentoura-yellow" /> {location}</span>
                            <span className="flex items-center gap-1"><FiStar className="text-zentoura-yellow fill-current" /> {hotel.rating} {t('common.stars')}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Description */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4 font-display text-zentoura-deepest">{t('common.aboutHotel')}</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>

                        {/* Amenities */}
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-4 font-display">{t('common.amenities')}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {(Array.isArray(hotel.amenities) ? hotel.amenities : ['WiFi', 'Pool', 'Parking', 'Restaurant', 'Gym', 'Spa']).map((amenity, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-gray-600">
                                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                            <FiCheck className="w-4 h-4" />
                                        </div>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Rooms Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 font-display text-zentoura-deepest">{t('common.availableRooms')}</h2>
                        <div className="space-y-6">
                            {(hotel.rooms || []).map((room) => (
                                <RoomCard key={room.id} room={room} handleBookClick={handleBookClick} t={t} />
                            ))}
                            {(!hotel.rooms || hotel.rooms.length === 0) && (
                                <div className="text-center py-12 bg-white rounded-3xl border border-dashed text-gray-400">
                                    {t('hotels.noRoomsListed')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold font-display text-zentoura-deepest">{t('common.guestReviews')}</h2>
                                <p className="text-sm text-gray-500">{t('common.seeWhatOthersSay') || 'See what other guests have to say about their stay.'}</p>
                            </div>
                            <button
                                onClick={() => setShowReviews(!showReviews)}
                                className="flex items-center gap-3 px-6 py-3 bg-zentoura-primary/10 text-zentoura-primary rounded-2xl font-bold hover:bg-zentoura-primary hover:text-white transition-all duration-300"
                            >
                                <FiMessageSquare />
                                <span>{showReviews ? (t('common.hideReviews') || 'Hide Reviews') : (t('common.showReviews') || 'Show Reviews')}</span>
                                {showReviews ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showReviews && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-8 border-t border-gray-100">
                                        <div className="flex items-center gap-4 mb-10 p-4 bg-zentoura-yellow/5 rounded-2xl inline-flex">
                                            <FiStar className="text-zentoura-yellow fill-current w-6 h-6" />
                                            <div>
                                                <div className="text-2xl font-bold text-zentoura-deepest">{hotel.rating} / 5</div>
                                                <div className="text-sm text-gray-400 font-medium">{reviews.length} {t('common.totalReviews') || 'Verified Reviews'}</div>
                                            </div>
                                        </div>

                                        {/* Rating Form */}
                                        {user ? (
                                            <div className="mb-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                                <h3 className="text-lg font-bold mb-4">{t('common.rateExperience')}</h3>
                                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                                className={`text-2xl transition-colors ${star <= newReview.rating ? 'text-zentoura-yellow' : 'text-gray-300'}`}
                                                            >
                                                                <FiStar className={star <= newReview.rating ? 'fill-current' : ''} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <textarea
                                                        value={newReview.comment}
                                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                        placeholder={t('common.shareHotelExperiencePlaceholder')}
                                                        className="w-full p-4 bg-white rounded-xl border-gray-200 focus:ring-2 focus:ring-zentoura-primary min-h-[100px]"
                                                        required
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={submittingReview}
                                                        className="px-8 py-3 bg-zentoura-deep text-white font-bold rounded-xl hover:bg-zentoura-deepest transition-all shadow-lg shadow-zentoura-deep/20 disabled:opacity-50"
                                                    >
                                                        {submittingReview ? t('common.submitting') : t('common.postReview')}
                                                    </button>
                                                </form>
                                            </div>
                                        ) : (
                                            <div className="mb-12 p-6 bg-blue-50 rounded-2xl text-center">
                                                <p className="text-blue-600 mb-4">{t('common.pleaseLoginToShareExperience')}</p>
                                                <button
                                                    onClick={() => navigate('/login', { state: { from: `/hotels/${id}` } })}
                                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg"
                                                >
                                                    {t('common.loginNow')}
                                                </button>
                                            </div>
                                        )}

                                        {/* Review List */}
                                        <div className="space-y-8">
                                            {reviews.length > 0 ? (
                                                reviews.map((review) => (
                                                    <div key={review.id} className="border-b border-gray-50 pb-8 last:border-0 last:pb-0">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-zentoura-primary/10 flex items-center justify-center text-zentoura-primary font-bold">
                                                                    {review.user?.name?.charAt(0) || 'U'}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-zentoura-deepest">{review.user?.name}</h4>
                                                                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-zentoura-yellow">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <FiStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-200'} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 leading-relaxed italic">
                                                            "{review.comment}"
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-12 text-gray-400">
                                                    {t('common.noReviewsYetStay')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar - Quick Info */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-4 font-display">{t('common.overview')}</h3>
                        <p className="text-sm text-gray-500 mb-6">{t('hotels.overviewText', { name, location })}</p>
                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-gray-50">
                                <span className="text-gray-500">{t('common.checkIn')}</span>
                                <span className="font-bold">2:00 PM</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-50">
                                <span className="text-gray-500">{t('common.checkOut')}</span>
                                <span className="font-bold">11:00 AM</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-50">
                                <span className="text-gray-500">{t('common.cancellation')}</span>
                                <span className="font-bold text-green-600">{t('common.freeCancellation')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {showBookingModal && selectedRoom && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                            >
                                ✕
                            </button>

                            <h3 className="text-2xl font-bold font-display mb-2">{t('common.bookStay')}</h3>
                            <p className="text-gray-500 mb-6">{t('common.at')} {name}</p>

                            <form onSubmit={handleBookingSubmit} className="space-y-4">
                                {/* Room Selection Dropdown */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Select Room Type</label>
                                    <select
                                        required
                                        value={selectedRoom?.id || ''}
                                        onChange={(e) => {
                                            const room = hotel.rooms.find(r => r.id === parseInt(e.target.value));
                                            setSelectedRoom(room);
                                        }}
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                    >
                                        <option value="">Choose a room...</option>
                                        {(hotel.rooms || []).map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.name} - Rs. {room.pricePerNight}/night ({room.bedrooms} Bed, {room.maxGuests} Guests)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Room Details Display */}
                                {selectedRoom && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                            <span className="flex items-center gap-1"><FiUsers /> Up to {selectedRoom.maxGuests} Guests</span>
                                            <span className="flex items-center gap-1"><FiMaximize /> {selectedRoom.bedrooms} Bedroom</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(Array.isArray(selectedRoom.amenities) ? selectedRoom.amenities : []).map((am, i) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-white border border-gray-100 text-gray-600 rounded-md">{am}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Check In</label>
                                        <input
                                            type="date"
                                            required
                                            min={today}
                                            value={bookingData.checkIn}
                                            onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Check Out</label>
                                        <input
                                            type="date"
                                            required
                                            min={bookingData.checkIn || tomorrow}
                                            value={bookingData.checkOut}
                                            onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Guests</label>
                                        <select
                                            value={bookingData.guests}
                                            onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                            disabled={!selectedRoom}
                                        >
                                            {selectedRoom ? (
                                                [...Array(selectedRoom.maxGuests)].map((_, i) => (
                                                    <option key={i} value={i + 1}>{i + 1} Guests</option>
                                                ))
                                            ) : (
                                                <option value="1">Select a room first</option>
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Number of Rooms</label>
                                        <select
                                            value={bookingData.numRooms}
                                            onChange={(e) => setBookingData({ ...bookingData, numRooms: parseInt(e.target.value) })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                            disabled={!selectedRoom}
                                        >
                                            {selectedRoom ? (
                                                [...Array(Math.min(10, selectedRoom.availableRooms ?? selectedRoom.totalRooms))].map((_, i) => (
                                                    <option key={i} value={i + 1}>{i + 1} Room{i > 0 && 's'}</option>
                                                ))
                                            ) : (
                                                <option value="1">1 Room</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Payment Method</label>
                                        <select
                                            value={bookingData.paymentMethod}
                                            onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                        >
                                            <option value="credit">Credit Card</option>
                                            <option value="debit">Debit Card</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Card Type</label>
                                        <select
                                            value={bookingData.cardType}
                                            onChange={(e) => setBookingData({ ...bookingData, cardType: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                        >
                                            <option value="visa">Visa</option>
                                            <option value="master">Master Card</option>
                                            <option value="Amex">Amex</option>
                                            <option value="LankaPay">LankaPay</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            value={bookingData.cardNumber}
                                            onChange={(e) => setBookingData({ ...bookingData, cardNumber: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={bookingData.expiryDate}
                                                onChange={(e) => setBookingData({ ...bookingData, expiryDate: e.target.value })}
                                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">CVC</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={bookingData.cvc}
                                                onChange={(e) => setBookingData({ ...bookingData, cvc: e.target.value })}
                                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Room Price ({bookingData.numRooms} Room{bookingData.numRooms > 1 && 's'})</span>
                                        <span>Rs. {selectedRoom?.pricePerNight * bookingData.numRooms} / night</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Stay Duration</span>
                                        <span>{nights} Night{nights > 1 && 's'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-2">
                                        <span className="font-bold text-gray-700">Total to Pay</span>
                                        <span className="text-2xl font-bold text-zentoura-primary">
                                            Rs. {totalPrice}
                                        </span>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={selectedRoom?.availableRooms === 0 || nights === 0}
                                        className={`w-full py-4 mt-4 text-white font-bold rounded-xl transition-all shadow-xl 
                                            ${(selectedRoom?.availableRooms === 0 || nights === 0)
                                                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                                : 'bg-zentoura-deep hover:scale-[1.02] shadow-zentoura-deep/20'}`}
                                    >
                                        {selectedRoom?.availableRooms === 0 ? 'No Rooms Available' :
                                            nights === 0 ? 'Select Valid Dates' : 'Confirm & Pay'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Extracted Room Card for specialized hooks
const RoomCard = ({ room, handleBookClick, t }) => {
    // Backend handles translation now
    const roomName = room.name;
    const roomType = room.type;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
            <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                <img
                    src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"
                    alt={roomName}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-zentoura-deepest">{roomName}</h3>
                        {room.availableRooms !== undefined ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${room.availableRooms > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {room.availableRooms > 0 ? `${room.availableRooms} ${t('common.left')}` : t('common.soldOut')}
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                                {t('common.available')}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><FiUsers /> {t('common.upTo')} {room.maxGuests} {t('common.guests')}</span>
                        <span className="flex items-center gap-1"><FiMaximize /> {room.bedrooms} {t('common.bedroom')}</span>
                        {roomType && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase tracking-wider">{roomType}</span>}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(Array.isArray(room.amenities) ? room.amenities : ['TV', 'AC', 'Breakfast']).map((am, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                                {am}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-3xl font-bold text-zentoura-primary">Rs. {room.pricePerNight}</span>
                        <span className="text-gray-400 text-sm"> / {t('common.night')}</span>
                    </div>
                    <button
                        onClick={() => handleBookClick(room)}
                        className="px-6 py-3 bg-zentoura-deep text-white font-bold rounded-xl hover:bg-zentoura-deepest transition-colors shadow-lg shadow-zentoura-deep/20"
                    >
                        {t('common.bookNow')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
