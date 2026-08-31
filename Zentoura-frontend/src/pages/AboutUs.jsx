import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiMapPin, FiHeart, FiGlobe, FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
    const { t } = useTranslation();
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const stats = [
        { icon: FiUsers, value: '1k+', label: t('aboutUs.stats.travelers'), color: 'text-blue-500' },
        { icon: FiMapPin, value: '25+', label: t('aboutUs.stats.destinations'), color: 'text-green-500' },
        { icon: FiAward, value: '2026', label: t('aboutUs.stats.founded'), color: 'text-purple-500' },
        { icon: FiHeart, value: '100%', label: t('aboutUs.stats.commitment'), color: 'text-red-500' },
    ];

    const features = [
        {
            icon: FiGlobe,
            title: t('aboutUs.features.islandWide.title'),
            desc: t('aboutUs.features.islandWide.desc')
        },
        {
            icon: FiShield,
            title: t('aboutUs.features.verifiedHosts.title'),
            desc: t('aboutUs.features.verifiedHosts.desc')
        },
        {
            icon: FiHeart,
            title: t('aboutUs.features.authenticTravel.title'),
            desc: t('aboutUs.features.authenticTravel.desc')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* 1. Hero Section with Parallax-like feel */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000"
                        alt="Travel Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
                            {t('aboutUs.title').split(' ')[0]} {t('aboutUs.title').split(' ')[1]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">{t('aboutUs.title').split(' ').slice(2).join(' ')}</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
                            {t('aboutUs.subtitle')}
                        </motion.p>
                    </motion.div>
                </div>
            </div>

            {/* 2. Mission & Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-1 w-12 bg-primary-500 rounded-full"></span>
                            <span className="text-primary-500 font-bold uppercase tracking-widest text-sm">{t('aboutUs.missionLabel')}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            {t('aboutUs.missionTitle').split(' of ')[0]} <span className="gradient-text">{t('aboutUs.missionTitle').split(' of ')[1] || 'Sri Lanka'}</span>
                        </h2>
                        <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>{t('aboutUs.missionDesc1')}</p>
                            <p>{t('aboutUs.missionDesc2')}</p>
                        </div>

                        {/* Features List */}
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                                >
                                    <feature.icon className="w-8 h-8 text-primary-500 mb-3" />
                                    <h4 className="font-bold text-gray-900 dark:text-white">{feature.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image Collage */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=800"
                                className="rounded-2xl shadow-xl w-full h-80 object-cover transform translate-y-12"
                                alt="Mission 1"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800"
                                className="rounded-2xl shadow-xl w-full h-80 object-cover"
                                alt="Mission 2"
                            />
                        </div>
                        {/* Decoration */}
                        <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-primary-100/40 to-transparent dark:from-primary-900/20 blur-3xl opacity-50"></div>
                    </motion.div>
                </div>
            </div>

            {/* 3. Stats Section */}
            <div className="bg-white dark:bg-gray-800 py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-100 dark:bg-secondary-900/20 rounded-full blur-3xl -ml-32 -mb-32 opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md group"
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-600 shadow-sm mb-4 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 font-display">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide text-sm">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Journey/Timeline Placeholder (Simple Version) */}
            <div className="py-24 max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-12">{t('aboutUs.journey.title')}</h2>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                    {[
                        { year: 'Jan 2026', title: t('aboutUs.journey.idea.title'), desc: t('aboutUs.journey.idea.desc') },
                        { year: 'Mar 2026', title: t('aboutUs.journey.launch.title'), desc: t('aboutUs.journey.launch.desc') },
                        { year: 'Present', title: t('aboutUs.journey.growing.title'), desc: t('aboutUs.journey.growing.desc') }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-200 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <span className="font-bold text-primary-500">{item.year}</span>
                                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                <p className="text-gray-500 text-sm">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
