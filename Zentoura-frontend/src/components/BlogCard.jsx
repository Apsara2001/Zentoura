import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight, FiTag } from 'react-icons/fi';
import { IMAGE_BASE_URL } from '../api/axios';
import { useTranslation } from 'react-i18next';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';

const BlogCard = ({ blog }) => {
    const { t } = useTranslation();

    // Dynamic translation for blog content
    const { translatedText: translatedTitle } = useDynamicTranslation(blog.title);
    const { translatedText: translatedShortDesc } = useDynamicTranslation(blog.shortDescription || blog.content?.substring(0, 150) + '...');
    const { translatedText: translatedCategory } = useDynamicTranslation(blog.category || 'General');

    const imageUrl = blog.featuredImage
        ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : `${IMAGE_BASE_URL}/${blog.featuredImage}`)
        : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl shadow-zentoura-deep/5 border border-zentoura-deep/10 hover:border-zentoura-deep/30 transition-all duration-500"
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-zentoura-deep text-xs font-bold rounded-full shadow-lg flex items-center space-x-2">
                        <FiTag className="w-3 h-3" />
                        <span>{translatedCategory}</span>
                    </span>
                </div>

                {/* Featured Badge */}
                {blog.isFeatured && (
                    <div className="absolute top-4 right-4 animate-pulse">
                        <span className="px-3 py-1 bg-zentoura-yellow text-zentoura-deepest text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl">
                            Featured
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex items-center space-x-4 mb-3 text-[10px] uppercase tracking-widest font-bold text-zentoura-deep/60">
                    <span className="flex items-center space-x-1">
                        <FiUser className="w-3 h-3" />
                        <span>{blog.author?.name || 'Zentoura Team'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                        <FiCalendar className="w-3 h-3" />
                        <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                </div>

                <h3 className="text-xl font-display font-bold text-zentoura-deepest mb-3 line-clamp-2 leading-tight group-hover:text-zentoura-deep transition-colors">
                    {translatedTitle}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {translatedShortDesc}
                </p>

                <Link
                    to={`/blogs/${blog.id}`}
                    className="flex items-center space-x-2 text-zentoura-deep font-bold text-sm group/link hover:text-zentoura-deep/80 transition-colors"
                >
                    <span>{t('common.discoverStory')}</span>
                    <FiArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
};

export default BlogCard;
