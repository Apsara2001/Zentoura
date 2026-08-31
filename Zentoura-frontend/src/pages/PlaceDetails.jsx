import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import Loader from '../components/Loader';
import { useTranslation } from 'react-i18next';


const PlaceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [showReviews, setShowReviews] = useState(false);
    const { t, i18n } = useTranslation();

    // Backend handles translation now
    const name = place?.name;
    const location = place?.location;
    const shortDesc = place?.short_description;
    const fullDesc = place?.full_description;

    useEffect(() => {
        fetchPlaceDetails();
        fetchReviews();
    }, [id, i18n.language]);

    const fetchPlaceDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/places/${id}`);
            setPlace(response.data.data);
        } catch (error) {
            console.error('Error fetching place details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/reviews/place/${id}`);
            setReviews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const submitReview = async () => {
        if (!newRating) return;
        try {
            setSubmitting(true);
            await axios.post('/reviews', {
                placeId: parseInt(id),
                rating: newRating,
                comment: newComment
            });
            setNewRating(0);
            setNewComment('');
            fetchReviews();
            fetchPlaceDetails(); // To get updated average rating
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (!place) return <div className="text-center py-20 font-bold text-zentoura-deep">{t('common.placeNotFound')}</div>;

    const imageUrl = place.image
        ? (place.image.startsWith('http') ? place.image : `${IMAGE_BASE_URL}/${place.image}`)
        : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img
                    src={imageUrl}
                    className="w-full h-full object-cover"
                    alt={place.name}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-24 left-4 md:left-8 z-10">
                    <button
                        onClick={() => navigate('/places')}
                        className="flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm transition-all"
                    >
                        <FiArrowLeft /> {t('common.backToPlaces') || 'Back to Places'}
                    </button>
                </div>
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
                            <span className="flex items-center gap-1 bg-zentoura-yellow/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                <FiStar className="text-zentoura-yellow fill-current" />
                                <span className="font-bold">{place.rating} / 5</span>
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Description */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4 font-display text-zentoura-deepest">{t('common.about')} {name}</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg mb-6">{shortDesc}</p>
                        <div className="h-px bg-gray-100 my-6"></div>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{fullDesc}</p>
                    </div>

                    {/* Ratings & Reviews */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold font-display text-zentoura-deepest">{t('common.reviewsAndRatings')}</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-zentoura-yellow/10 px-4 py-2 rounded-xl">
                                    <FiStar className="text-zentoura-yellow fill-current" />
                                    <span className="text-lg font-bold text-zentoura-deep">{place.rating} / 5</span>
                                    <span className="text-gray-400 text-sm">({reviews.length} {t('common.reviews')})</span>
                                </div>
                                <button
                                    onClick={() => setShowReviews(!showReviews)}
                                    className="flex items-center gap-2 px-4 py-2 bg-zentoura-primary text-white rounded-xl hover:bg-zentoura-deep transition-all font-bold"
                                >
                                    {showReviews ? (
                                        <>
                                            <FiChevronUp /> {t('common.hideReviews') || 'Hide Reviews'}
                                        </>
                                    ) : (
                                        <>
                                            <FiChevronDown /> {t('common.showReviews') || 'Show Reviews'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Review */}
                        {showReviews && (
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h3 className="font-bold mb-4">{t('common.rateExperience')}</h3>
                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setNewRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <FiStar
                                                className={`w-8 h-8 ${star <= newRating ? 'text-zentoura-yellow fill-current' : 'text-gray-300'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={t('common.shareExperiencePlaceholder')}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-zentoura-primary outline-none h-24 mb-4"
                                />
                                <button
                                    onClick={submitReview}
                                    disabled={submitting || !newRating}
                                    className="px-8 py-3 bg-zentoura-primary text-white font-bold rounded-xl hover:bg-zentoura-deep transition-all disabled:opacity-50"
                                >
                                    {submitting ? t('common.submitting') : t('common.postReview')}
                                </button>
                            </div>
                        )}

                        {/* Reviews List */}
                        {showReviews && (
                            <div className="space-y-6">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-zentoura-lavender flex items-center justify-center font-bold text-zentoura-deep">
                                                        {review.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{review.user?.name || t('common.traveller')}</p>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <FiStar
                                                                    key={star}
                                                                    className={`w-3 h-3 ${star <= review.rating ? 'text-zentoura-yellow fill-current' : 'text-gray-200'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 pl-13 transition-all">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 py-8 italic">{t('common.noReviewsYet')}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Map */}
                    <div className="bg-white rounded-3xl p-2 shadow-sm overflow-hidden">
                        <iframe
                            title="Map"
                            width="100%"
                            height="300"
                            style={{ border: 0, borderRadius: '1.5rem' }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps?q=${place.latitude},${place.longitude}&z=14&output=embed`}
                        ></iframe>
                        <div className="p-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FiMapPin className="text-zentoura-primary" /> {t('common.location') || 'Location'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{location}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceDetails;
