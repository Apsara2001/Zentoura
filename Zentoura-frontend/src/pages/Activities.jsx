import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiActivity } from 'react-icons/fi';
import axios from '../api/axios';
import ActivityCard from '../components/ActivityCard';
import { SkeletonList } from '../components/Loader';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '../context/LanguageContext';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';

const Activities = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const { translatedText: translatedTitle } = useDynamicTranslation(t('activites'));
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [minRating, setMinRating] = useState(0);
    const [page, setPage] = useState(1);

    const categories = [
        { id: 'All', label: t('common.allCategories') },
        { id: 'Fun', label: 'Fun' },
        { id: 'Thrilling', label: 'Thrilling' },
        { id: 'Adventurous', label: 'Adventurous' }
    ];

    useEffect(() => {
        fetchActivities();
    }, [search, selectedCategory, minRating, page, language]);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 9,
                search,
                category: selectedCategory === 'All' ? '' : selectedCategory,
                minRating: minRating
            };
            const response = await axios.get('/activities', { params });
            setActivities(response.data.data || []);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zentoura-primary/10 text-zentoura-primary rounded-full text-xs font-black uppercase tracking-widest"
                    >
                        <FiActivity /> Unforgettable Experiences
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative text-center px-4"
                    >
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
                            Epic <span className="text-zentoura-yellow">{translatedTitle}</span>
                        </h1>
                        <p className="text-zentoura-lavender text-lg max-w-2xl mx-auto">
                            {t('homepage.activitiesDesc')}
                        </p>
                    </motion.div>
                </div>

                {/* Filters Section */}
                <div className="glass-card p-6 md:p-8 rounded-[2.5rem] shadow-2xl mb-12 border border-white dark:border-gray-800 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Search Input */}
                        <div className="relative w-full lg:w-80 xl:w-96 group">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-zentoura-deep/30 group-focus-within:text-zentoura-primary transition-colors" />
                            <input
                                type="text"
                                placeholder={t('common.searchActivites') || 'Explore activities...'}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-gray-700/50 rounded-2xl border-none focus:ring-4 focus:ring-zentoura-primary/10 transition-all text-zentoura-deepest dark:text-white font-bold placeholder:text-zentoura-deep/20"
                            />
                        </div>

                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat.id
                                        ? 'bg-white dark:bg-gray-700 text-zentoura-primary shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Rating Filter */}
                        <div className="relative group">
                            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={minRating}
                                onChange={(e) => setMinRating(Number(e.target.value))}
                                className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-zentoura-primary outline-none transition-all dark:text-white appearance-none font-bold"
                            >
                                <option value="0">All Ratings</option>
                                <option value="4">4.0+ Stars</option>
                                <option value="3">3.0+ Stars</option>
                                <option value="2">2.0+ Stars</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <SkeletonList />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        <AnimatePresence mode="popLayout">
                            {activities.length > 0 ? (
                                activities.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <ActivityCard activity={activity} />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-20 text-center space-y-4"
                                >
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                                        <FiActivity className="w-12 h-12 text-zentoura-deep/20 mx-auto mb-4" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zentoura-deepest">{t('common.noActivites')}</h3>
                                    <p className="text-zentoura-deep/60">{t('common.tryAdjustingFilters') || 'Try adjusting your filters.'}</p>
                                    <button
                                        onClick={() => { setSearch(''); setSelectedCategory('All'); setMinRating(0); }}
                                        className="text-zentoura-primary font-bold hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activities;
