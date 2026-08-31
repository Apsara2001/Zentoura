import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiStar, FiZap } from 'react-icons/fi';
import { IMAGE_BASE_URL } from '../api/axios';
import { useTranslation } from 'react-i18next';


const ActivityCard = ({ activity }) => {
    const { t } = useTranslation();
    const translatedName = activity.name;
    const translatedLocation = activity.location;
    const translatedDescription = activity.short_description || activity.description?.substring(0, 100) + '...';

    const translatedCategory = activity.category;
    const translatedDifficulty = activity.difficulty_level;

    const imageUrl = activity.image
        ? (activity.image.startsWith('http') ? activity.image : `${IMAGE_BASE_URL}/${activity.image}`)
        : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800';

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white dark:border-gray-700"
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={activity.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-lg border border-white/20 text-white ${activity.category === 'Thrilling' ? 'bg-red-500/80' :
                        activity.category === 'Adventurous' ? 'bg-orange-500/80' : 'bg-zentoura-primary/80'
                        }`}>
                        {translatedCategory}
                    </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 border border-white/30">
                    <FiStar className="text-zentoura-yellow fill-current w-4 h-4" />
                    <span className="font-black text-zentoura-deepest dark:text-white text-sm">
                        {activity.rating > 0 ? activity.rating : '0.0'}
                    </span>
                    <span className="text-gray-400 text-[10px] font-bold">({activity.reviewCount || 0})</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-display text-zentoura-deepest line-clamp-1">{translatedName}</h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <FiMapPin className="text-zentoura-primary" />
                    <span className="line-clamp-1">{translatedLocation}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                    {translatedDescription}
                </p>

                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zentoura-calm dark:bg-gray-700 rounded-lg text-zentoura-deep dark:text-gray-300 font-bold">
                        <span className="w-2 h-2 rounded-full bg-zentoura-primary animate-pulse" />
                        {translatedDifficulty}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 mb-4">
                    <div className="text-zentoura-primary font-bold">
                        <span className="text-2xl">Rs. {activity.price}</span>
                        <span className="text-sm text-gray-500 font-normal"> / {t('common.perExplorer')}</span>
                    </div>
                </div>

                <div className="pt-2">
                    <Link
                        to={`/activities/${activity.id}`}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-zentoura-deepest text-white font-black rounded-2xl transition-all duration-300 hover:bg-zentoura-deep hover:shadow-xl hover:shadow-zentoura-deep/20 group-hover:scale-[1.02]"
                    >
                        {t('common.viewDetails')}

                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ActivityCard;
