import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMap, FiShield, FiSend, FiClock, FiArrowRight } from 'react-icons/fi';
import Hero from '../components/Hero';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div>
            <Hero />

            {/* Visual Banner Section */}
            <section className="relative h-[400px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000"
                        alt="Adventure awaits"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
                </div>
                <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="glass-card p-10 rounded-3xl max-w-2xl bg-white/10 backdrop-blur-md border border-white/20"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                            {t('homepage.bannerTitle')}
                        </h2>
                        <p className="text-gray-100 text-lg md:text-xl">
                            {t('homepage.bannerSubtitle')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Navigation Sections - Interactive Cards */}
            <section className="section-container">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold">{t('homepage.discoverA')} <span className="gradient-text">{t('homepage.discoverB')}</span></h2>
                    <p className="text-muted max-w-2xl mx-auto">{t('homepage.discoverSubtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: t('common.featuredBlogs'),
                            desc: t('homepage.blogsDesc'),
                            image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
                            path: '/blogs',
                            cta: t('homepage.blogsCta')
                        },
                        {
                            title: t('common.topRatedHotels'),
                            desc: t('homepage.hotelsDesc'),
                            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
                            path: '/hotels',
                            cta: t('homepage.hotelsCta')
                        },
                        {
                            title: t('common.popularActivites'),
                            desc: t('homepage.activitiesDesc'),
                            image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1200',
                            path: '/activities',
                            cta: t('homepage.activitiesCta')
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                        >
                            <Link
                                to={item.path}
                                className="group relative block h-[500px] rounded-[2rem] overflow-hidden shadow-2xl transform transition-all duration-700 hover:-translate-y-4"
                            >
                                {/* Background Image */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-zentoura-deep/90 via-zentoura-deep/40 to-transparent group-hover:from-zentoura-primary/90 transition-colors duration-700"></div>

                                {/* Content */}
                                <div className="absolute inset-0 p-10 flex flex-col justify-end text-white space-y-4">
                                    <h3 className="text-4xl font-bold font-display leading-tight">{item.title}</h3>
                                    <p className="text-white/80 line-clamp-2 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                        {item.desc}
                                    </p>
                                    <div className="flex items-center space-x-2 pt-4 group">
                                        <span className="font-bold uppercase tracking-wider text-sm">{item.cta}</span>
                                        <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                                    </div>
                                </div>

                                {/* Shine Effect */}
                                <div className="absolute top-0 -left-full w-1/2 h-full bg-white/20 skew-x-[-25deg] transition-all duration-1000 group-hover:left-[150%]"></div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
            {/* Testimonials Section */}
            <section className="section-container bg-zentoura-lavender/10">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold">{t('homepage.testimonialsA')} <span className="gradient-text">{t('homepage.testimonialsB')}</span></h2>
                        <p className="text-muted max-w-2xl mx-auto">{t('homepage.testimonialsSubtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Arjun Perera', role: 'Culture Explorer', comment: 'The sunset view from Sigiriya Rock was breathtaking. Zentoura organized the perfect heritage tour for us!', rating: 5, avatar: 'https://i.pravatar.cc/150?u=arjun' },
                            { name: 'Elena Rossi', role: 'Nature Lover', comment: 'Waking up to the misty tea plantations in Ella was a dream. The local guides were so knowledgeable.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=elena' },
                            { name: 'Jack Thompson', role: 'Surfing Enthusiast', comment: 'Found the best hidden surfing spots in Weligama thanks to Zentoura. An absolute paradise!', rating: 5, avatar: 'https://i.pravatar.cc/150?u=jack' },
                        ].map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="glass-card p-8 relative"
                            >
                                <div className="flex items-center space-x-4 mb-6">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-zentoura-primary" />
                                    <div>
                                        <h4 className="font-bold">{testimonial.name}</h4>
                                        <p className="text-xs text-muted">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-sm italic text-gray-600 dark:text-gray-300">"{testimonial.comment}"</p>
                                <div className="flex mt-4 text-zentoura-yellow">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Newsletter Section */}
            <section className="section-container pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] overflow-hidden bg-gradient-aura p-12 md:p-20 text-center text-white"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-zentoura-secondary/20 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                            {t('homepage.newsletterTitle')}
                        </h2>
                        <p className="text-white/80 text-xl font-medium max-w-lg mx-auto">
                            {t('homepage.newsletterSubtitle')}
                        </p>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
