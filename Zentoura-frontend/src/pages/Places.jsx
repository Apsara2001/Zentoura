import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin } from 'react-icons/fi';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import { SkeletonList } from '../components/Loader';
import { useTranslation } from 'react-i18next';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';


import { useLanguage } from '../context/LanguageContext';

const Places = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const { translatedText: translatedTitle } = useDynamicTranslation(t('amazingPlaces'));
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('rating'); // 'rating' or 'newest'
    const location = useLocation(); // Track navigation changes

    useEffect(() => {
        fetchPlaces();
    }, [sortBy, location.pathname, language]); // Re-fetch when returning to this page or language changes

    const fetchPlaces = async () => {
        try {
            // In a real app, pass sort param to API. For now client-side sort if API doesn't support it or if list is small.
            // But let's pretend API supports it or just sort locally.
            // controller supports order: [['rating', 'DESC']] by default but let's be explicit if needed.
            const response = await axios.get('/places');
            let data = response.data.data || [];

            if (sortBy === 'rating') {
                data.sort((a, b) => b.rating - a.rating);
            } else {
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            setPlaces(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20">
            <div className="section-container">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-5xl font-bold text-center mb-12">
                        <span className="gradient-text">{translatedTitle}</span>
                    </h1>

                    {/* Sort Filter */}
                    <div className="flex justify-end mb-8 px-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-zentoura-primary outline-none"
                        >
                            <option value="rating">{t('common.highestRated')}</option>
                            <option value="newest">{t('common.newestAdded')}</option>
                        </select>
                    </div>

                    {loading ? <SkeletonList /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {places.map((place) => (
                                <PlaceCard key={place.id} place={place} t={t} />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

// Extracted PlaceCard for cleaner code and specialized translation hooks per item
const PlaceCard = ({ place, t }) => {
    // Dynamic translation for place content
    const { translatedText: translatedName } = useDynamicTranslation(place.name);
    const { translatedText: translatedLocation } = useDynamicTranslation(place.location);
    const { translatedText: translatedShortDesc } = useDynamicTranslation(place.short_description);

    return (
        <motion.div
            key={place.id}
            whileHover={{ y: -8 }}
            className="glass-card rounded-2xl overflow-hidden card-hover flex flex-col h-full"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={place.image ? (place.image.startsWith('http') ? place.image : `${IMAGE_BASE_URL}/${place.image}`) : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
                    <FiStar className="text-zentoura-yellow fill-current" />
                    <span>{place.rating} / 5</span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-display text-zentoura-deepest line-clamp-1">{translatedName}</h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <FiMapPin className="text-zentoura-primary" />
                    <span className="line-clamp-1">{translatedLocation}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                    {translatedShortDesc}
                </p>

                <Link
                    to={`/places/${place.id}`}
                    className="w-full py-3 rounded-xl border-2 border-zentoura-primary/20 text-zentoura-primary font-bold hover:bg-zentoura-primary hover:text-white transition-all text-center block"
                >
                    {t('common.viewDetails')}
                </Link>
            </div>
        </motion.div>
    );
};

export default Places;
