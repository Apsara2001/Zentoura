import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiArrowLeft, FiClock, FiTag, FiActivity, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';


import ActivityBookingModal from '../components/ActivityBookingModal';

const ActivityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activity, setActivity] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviews, setShowReviews] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const { t, i18n } = useTranslation();

    // Backend handles translation now
    const name = activity?.name;
    const shortDesc = activity?.short_description;
    const fullDesc = activity?.full_description || activity?.description;
    const location = activity?.location;
    const category = activity?.category;
    const difficulty = activity?.difficulty_level;

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchActivityDetails();
        fetchReviews();
    }, [id, i18n.language]);

    const fetchActivityDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/activities/${id}`);
            setActivity(response.data.data);
        } catch (error) {
            console.error('Error fetching activity details:', error);
            toast.error(t('common.failedToLoadActivity'));
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/reviews/activity/${id}`);
            setReviews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const submitReview = async () => {
        if (!user) {
            toast.error(t('common.pleaseLoginToReview'));
            return;
        }
        if (!newRating) {
            toast.error(t('common.pleaseSelectRating'));
            return;
        }
        if (!newComment.trim()) {
            toast.error(t('common.pleaseShareThoughts'));
            return;
        }
        try {
            setSubmitting(true);
            await axios.post('/reviews', {
                activityId: parseInt(id),
                rating: newRating,
                comment: newComment
            });
            toast.success(t('common.reviewSubmitted'));
            setNewRating(0);
            setNewComment('');
            fetchReviews();
            fetchActivityDetails();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.message || t('common.failedToSubmitReview'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (!activity) return <div className="text-center py-40 font-black text-zentoura-deep">{t('activities.notFound')}</div>;

    const imageUrl = activity.image
        ? (activity.image.startsWith('http') ? activity.image : `${IMAGE_BASE_URL}/${activity.image}`)
        : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
            {/* Hero Section */}
            <div className="relative h-[75vh] w-full overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={imageUrl}
                    className="w-full h-full object-cover"
                    alt={activity.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-32 left-8 md:left-16 z-20">
                    <button
                        onClick={() => navigate('/activities')}
                        className="group flex items-center gap-3 text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20 transition-all font-bold"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        {t('common.exploreMoreAdventures') || 'Explore more adventures'}
                    </button>
                </div>

                <div className="absolute bottom-16 left-0 w-full px-8 md:px-16 text-white">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap gap-3"
                        >
                            <span className="px-4 py-1.5 bg-zentoura-primary text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-zentoura-primary/30">
                                {category}
                            </span>
                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                                {difficulty}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-black leading-tight drop-shadow-2xl"
                        >
                            {name}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center gap-8 text-xl"
                        >
                            <div className="flex items-center gap-2 drop-shadow-lg">
                                <FiMapPin className="text-zentoura-primary" />
                                <span className="font-bold">{location}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/90 text-zentoura-deepest px-6 py-2.5 rounded-[1.5rem] shadow-2xl">
                                <FiStar className="text-zentoura-yellow fill-current" />
                                <span className="font-black">{activity.rating > 0 ? activity.rating : t('common.new')}</span>
                                <span className="text-gray-400 text-sm font-bold">({activity.reviewCount || 0} {t('common.reviews')})</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-16 -mt-10 relative z-30 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white dark:border-gray-800"
                    >
                        <h2 className="text-3xl font-black mb-8 text-zentoura-deepest dark:text-white flex items-center gap-4">
                            <span className="w-1.5 h-10 bg-zentoura-primary rounded-full shadow-lg shadow-zentoura-primary/20" />
                            {t('activities.details') || 'Adventure Details'}
                        </h2>

                        <div className="space-y-8">
                            <p className="text-gray-500 dark:text-gray-400 text-xl font-bold italic leading-relaxed">
                                {shortDesc}
                            </p>
                            <div className="w-20 h-1 bg-gray-100 dark:bg-gray-800 rounded-full" />
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                                {fullDesc}
                            </p>
                        </div>
                    </motion.div>

                    {/* Ratings & Breakdown */}
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white dark:border-gray-800 space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-50 dark:border-gray-800 pb-10">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-zentoura-deepest dark:text-white">{t('common.travelerInsights') || 'Traveler Insights'}</h2>
                                <p className="text-gray-500 font-bold">{t('common.travelerInsightsSubtitle') || 'What the community says about this experience'}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-zentoura-calm dark:bg-gray-800 p-8 rounded-[2.5rem] min-w-[160px]">
                                <span className="text-5xl font-black text-zentoura-deepest dark:text-white">{activity.rating}</span>
                                <div className="flex gap-1 my-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <FiStar key={s} className={`w-4 h-4 ${s <= activity.rating ? 'text-zentoura-yellow fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{activity.reviewCount} {t('common.reviews')}</span>
                            </div>
                        </div>

                        {/* Breakdown Bars */}
                        {activity.breakdown && (
                            <div className="space-y-4">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 min-w-[60px]">
                                            <span className="font-black text-zentoura-deepest dark:text-white">{star}</span>
                                            <FiStar className="w-4 h-4 text-zentoura-yellow fill-current" />
                                        </div>
                                        <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${activity.reviewCount > 0 ? (activity.breakdown[star] / activity.reviewCount) * 100 : 0}%` }}
                                                className="h-full bg-zentoura-primary rounded-full shadow-lg shadow-zentoura-primary/20"
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-gray-400 min-w-[30px]">{activity.breakdown[star]}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit Review */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-black mb-6 text-zentoura-deepest dark:text-white italic">{t('common.howWasAdventure') || 'How was your adventure?'}</h3>
                            <div className="flex gap-3 mb-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setNewRating(star)}
                                        className="transition-all hover:scale-125 focus:outline-none"
                                    >
                                        <FiStar
                                            className={`w-10 h-10 ${star <= newRating ? 'text-zentoura-yellow fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={t('common.shareThoughtsPlaceholder')}
                                className="w-full p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-zentoura-primary/20 outline-none h-32 mb-6 transition-all text-gray-600 dark:text-gray-300"
                            />
                            <button
                                onClick={submitReview}
                                disabled={submitting || !newRating}
                                className="px-10 py-4 bg-zentoura-deepest text-white font-black rounded-2xl hover:bg-zentoura-deep transition-all shadow-2xl shadow-zentoura-deep/30 disabled:opacity-50 disabled:grayscale"
                            >
                                {submitting ? t('common.submitting') : t('common.shareExperience')}
                            </button>
                        </div>


                        {/* Toggle Reviews Button */}
                        <div className="flex justify-center py-4">
                            <button
                                onClick={() => setShowReviews(!showReviews)}
                                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-zentoura-primary font-black rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
                            >
                                {showReviews ? (
                                    <>
                                        {t('common.hideReviews') || 'Hide Reviews'} <FiChevronUp />
                                    </>
                                ) : (
                                    <>
                                        {t('common.showReviews') || 'Show Reviews'} ({reviews.length}) <FiChevronDown />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Reviews List */}
                        {showReviews && (
                            <div className="space-y-10">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="group flex gap-6 border-b border-gray-50 dark:border-gray-800 pb-10 last:border-0">
                                            <div className="w-16 h-16 rounded-[1.2rem] bg-zentoura-primary/10 flex-shrink-0 flex items-center justify-center font-black text-2xl text-zentoura-primary shadow-inner">
                                                {review.user?.name?.charAt(0) || 'E'}
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-lg font-black text-zentoura-deepest dark:text-white group-hover:text-zentoura-primary transition-colors">
                                                            {review.user?.name || t('activities.explorer')}
                                                        </p>
                                                        <div className="flex gap-1 mt-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <FiStar
                                                                    key={star}
                                                                    className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-zentoura-yellow fill-current' : 'text-gray-200 dark:text-gray-700'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-black text-gray-300 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-lg">
                                                        {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg italic">
                                                    "<ReviewComment text={review.comment} />"
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 space-y-4">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                            <FiActivity className="w-10 h-10" />
                                        </div>
                                        <p className="text-gray-400 font-bold italic">{t('common.beFirstReview') || 'Be the first to chart this course with a review!'}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 shadow-2xl border border-white dark:border-gray-800"
                    >
                        <div className="mb-8 p-6 bg-zentoura-calm dark:bg-gray-800 rounded-[2rem] text-center">
                            <span className="text-zentoura-primary text-xs font-black uppercase tracking-widest">{t('common.premiumExperience') || 'Premium Experience'}</span>
                            <div className="text-4xl font-black text-zentoura-deepest dark:text-white mt-2">
                                Rs. {activity.price}
                            </div>
                            <span className="text-gray-400 text-sm font-bold">{t('common.perExplorer') || 'per explorer'}</span>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                    <FiClock className="text-zentoura-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t('common.duration')}</span>
                                    <span className="font-bold">{t('common.flexibleTiming')}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                    <FiTag className="text-zentoura-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t('common.type')}</span>
                                    <span className="font-bold">{category} {t('common.adventure')}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsBookingModalOpen(true)}
                            className="w-full py-5 bg-zentoura-deepest text-white font-black rounded-2xl shadow-2xl shadow-zentoura-deep/40 hover:scale-[1.02] active:scale-95 transition-all text-lg"
                        >
                            {t('common.confirmAdventure') || 'Confirm Adventure'}
                        </button>
                    </motion.div>

                    {/* Map Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 shadow-2xl border border-white dark:border-gray-800 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-zentoura-deepest dark:text-white flex items-center gap-2">
                                <FiMapPin className="text-zentoura-primary" /> {t('common.adventureMap') || 'Adventure Map'}
                            </h3>
                        </div>

                        <div className="overflow-hidden rounded-[2rem] border border-gray-100 dark:border-gray-700">
                            {activity.latitude && activity.longitude ? (
                                <iframe
                                    width="100%"
                                    height="300"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://maps.google.com/maps?q=${activity.latitude},${activity.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="aspect-square bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center text-center p-8 gap-4 opacity-50">
                                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-400 animate-spin" />
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Map data being plotted...</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-zentoura-calm dark:bg-gray-800 rounded-2xl">
                            <p className="text-xs font-bold text-zentoura-primary line-clamp-2 leading-relaxed">
                                {location}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ActivityBookingModal
                activity={activity}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
            />
        </div>
    );
};

const ReviewComment = ({ text }) => {
    return <span>{text}</span>;
};

export default ActivityDetails;
