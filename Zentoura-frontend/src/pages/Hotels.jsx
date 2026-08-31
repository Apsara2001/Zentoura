import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import HotelCard from '../components/HotelCard';
import { SkeletonList } from '../components/Loader';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '../context/LanguageContext';

const Hotels = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        location: '',
        minPrice: '',
        maxPrice: '',
        minRating: ''
    });

    useEffect(() => {
        fetchHotels();
    }, [page, filters, language]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 9 };
            if (filters.location) params.location = filters.location;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.minRating) params.minRating = filters.minRating;

            const response = await axios.get('/hotels', { params });
            setHotels(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20">
            <div className="section-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-5xl font-bold text-center mb-12">
                        {t('homepage.findHotelTitle').split(' Hotel')[0]} <span className="gradient-text">{t('common.hotels')}</span>
                    </h1>

                    {/* Filters */}
                    <div className="glass-card p-6 rounded-xl mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <input
                                type="text"
                                placeholder={t('common.searchHotels')}
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                            />
                            <input
                                type="number"
                                placeholder={t('common.minPrice') || 'Min Price'}
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                            />
                            <input
                                type="number"
                                placeholder={t('common.maxPrice') || 'Max Price'}
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                            />
                            <select
                                value={filters.minRating}
                                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                            >
                                <option value="">{t('common.allRatings') || 'All Ratings'}</option>
                                <option value="5">5 {t('common.stars') || 'Stars'}</option>
                                <option value="4">4+ {t('common.stars') || 'Stars'}</option>
                                <option value="3">3+ {t('common.stars') || 'Stars'}</option>
                            </select>
                        </div>
                    </div>

                    {/* Hotel Grid */}
                    {loading ? (
                        <SkeletonList count={9} />
                    ) : hotels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hotels.map((hotel) => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-bold">{t('common.noHotels')}</h3>
                            <p className="text-gray-500">{t('common.tryAdjustingFilters') || 'Try adjusting your filters.'}</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-12 space-x-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                            >
                                {t('common.previous') || 'Previous'}
                            </button>
                            <span className="text-gray-600 dark:text-gray-400">
                                {t('common.page') || 'Page'} {page} {t('common.of') || 'of'} {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                            >
                                {t('common.next') || 'Next'}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Hotels;
