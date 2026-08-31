import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import BlogCard from '../components/BlogCard';
import { SkeletonList } from '../components/Loader';
import { FiSearch, FiFilter, FiActivity } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

const Blogs = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();

    const CATEGORIES = [
        { id: 'All', label: t('common.allCategories') },
        { id: 'Beaches', label: 'Beaches' },
        { id: 'Adventure', label: 'Adventure' },
        { id: 'Food & Culture', label: 'Food & Culture' },
        { id: 'Heritage', label: 'Heritage' },
        { id: 'Nature', label: 'Nature' }
    ];

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchBlogs();
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [page, search, selectedCategory, language]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 9,
                search,
                category: selectedCategory === 'All' ? '' : selectedCategory
            };

            const response = await axios.get('/blogs', { params });
            setBlogs(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zentoura-calm/30 pb-20">
            {/* Hero Section */}
            <div className="relative h-[40vh] bg-zentoura-deep overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1546768292-fb12f6c92568?w=1600"
                        className="w-full h-full object-cover"
                        alt="Sri Lanka Background"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-zentoura-deep/60 to-zentoura-deep/90" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative text-center px-4"
                >
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
                        Island <span className="text-zentoura-yellow">{t('common.blogs')}</span>
                    </h1>
                    <p className="text-zentoura-lavender text-lg max-w-2xl mx-auto">
                        {t('homepage.blogsDesc')}
                    </p>
                </motion.div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 -mt-10 relative z-10">
                {/* Controls Bar */}
                <div className="glass-card p-4 md:p-6 rounded-[2.5rem] shadow-2xl mb-12 flex flex-col lg:flex-row gap-8 items-center justify-between border-zentoura-lavender/20 bg-[#fbf8ff] dark:bg-gray-800/90 backdrop-blur-2xl">
                    {/* Search Section */}
                    <div className="relative w-full lg:w-80 xl:w-96 group">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-zentoura-deep/30 group-focus-within:text-zentoura-primary transition-colors" />
                        <input
                            type="text"
                            placeholder={t('common.searchStories')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-gray-700/50 rounded-2xl border-none focus:ring-4 focus:ring-zentoura-primary/10 transition-all text-zentoura-deepest dark:text-white font-bold placeholder:text-zentoura-deep/20"
                        />
                    </div>

                    {/* Categories UI */}
                    <div className="flex-1 flex flex-wrap justify-center gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                                className={`px-6 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 ${selectedCategory === cat.id
                                    ? 'bg-zentoura-deep text-white shadow-2xl shadow-zentoura-deep/30 scale-105'
                                    : 'bg-white/80 dark:bg-gray-700/80 text-zentoura-deep/40 dark:text-gray-400 hover:bg-white hover:text-zentoura-primary hover:shadow-lg'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Write Story CTA */}
                    <div className="w-full lg:w-auto">
                        <Link
                            to="/blogs/create"
                            className="btn-primary w-full lg:w-auto flex items-center justify-center space-x-3 shadow-2xl shadow-zentoura-primary/30 hover:scale-[1.05] active:scale-95 transition-all py-4 px-10 rounded-2xl group border-2 border-white/20"
                        >
                            <FiActivity className="w-5 h-5 group-hover:animate-pulse" />
                            <span className="font-black uppercase tracking-[0.15em] text-sm">{t('common.writeStory')}</span>
                        </Link>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <SkeletonList count={6} />
                ) : (
                    <AnimatePresence mode="wait">
                        {blogs.length > 0 ? (
                            <motion.div
                                key={selectedCategory + search}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {blogs.map((blog, index) => {
                                    const processedTags = Array.isArray(blog.tags)
                                        ? blog.tags.join(', ')
                                        : (typeof blog.tags === 'string' ? blog.tags : '');

                                    return (
                                        <BlogCard
                                            key={blog.id}
                                            blog={{ ...blog, tags: processedTags }}
                                            index={index}
                                        />
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-white rounded-3xl border border-dashed border-zentoura-deep/20"
                            >
                                <FiActivity className="w-12 h-12 text-zentoura-deep/20 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-zentoura-deepest">{t('common.noStories')}</h3>
                                <p className="text-zentoura-deep/60">{t('common.tryAdjustingFilters') || 'Try adjusting your filters or search terms.'}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-16 space-x-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-3 rounded-xl bg-white border border-zentoura-deep/10 text-zentoura-deep disabled:opacity-30 hover:bg-zentoura-lavender transition-all shadow-sm"
                        >
                            {t('common.previous') || 'Previous'}
                        </button>
                        <div className="flex items-center px-6 bg-white rounded-xl border border-zentoura-deep/10 text-zentoura-deepest font-bold">
                            {t('common.page') || 'Page'} {page} {t('common.of') || 'of'} {totalPages}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-3 rounded-xl bg-white border border-zentoura-deep/10 text-zentoura-deep disabled:opacity-30 hover:bg-zentoura-lavender transition-all shadow-sm"
                        >
                            {t('common.next') || 'Next'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;
