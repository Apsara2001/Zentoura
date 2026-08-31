import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiWifi, FiCoffee, FiWind } from 'react-icons/fi';
import { IMAGE_BASE_URL } from '../api/axios';
import { useTranslation } from 'react-i18next';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';

const HotelCard = ({ hotel }) => {
    const { t } = useTranslation();

    // Backend handles translation now
    const translatedName = hotel.name;
    const translatedLocation = hotel.location;
    const translatedDescription = hotel.description?.substring(0, 100) + '...';

    const imageUrl = hotel.image
        ? `${IMAGE_BASE_URL}/${hotel.image}`
        : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="glass-card rounded-xl overflow-hidden card-hover"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <FiStar className="w-4 h-4" />
                    <span>{hotel.rating} / 5</span>
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
                    {translatedDescription}
                </p>

                <div className="flex items-center justify-between mb-6">
                    <div className="text-zentoura-primary font-bold">
                        <span className="text-2xl">Rs. {hotel.base_price}</span>
                        <span className="text-sm text-gray-500 font-normal"> / {t('common.night')}</span>
                    </div>
                </div>

                <Link
                    to={`/hotels/${hotel.id}`}
                    className="w-full py-3 rounded-xl border-2 border-zentoura-primary/20 text-zentoura-primary font-bold hover:bg-zentoura-primary hover:text-white transition-all text-center block"
                >
                    {t('common.viewDetails')}
                </Link>
            </div>
        </motion.div>
    );
};

export default HotelCard;
