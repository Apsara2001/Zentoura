import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon, FiSearch, FiUser, FiLogOut, FiGlobe } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef(null);
    const userRef = useRef(null);
    const { user, logout, isAdmin } = useAuth();
    const { language, changeLanguage, languages } = useLanguage();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setIsUserOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg'
                : 'bg-white/50 dark:bg-gray-900/20 backdrop-blur-sm'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-2xl font-display font-bold gradient-text"
                        >
                            Zentoura
                        </motion.div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="nav-link">{t('common.home')}</Link>
                        <Link to="/blogs" className="nav-link">{t('common.blogs')}</Link>
                        <Link to="/hotels" className="nav-link">{t('common.hotels')}</Link>
                        <Link to="/places" className="nav-link">{t('common.places')}</Link>
                        <Link to="/activities" className="nav-link">{t('common.activities')}</Link>
                        <Link to="/about" className="nav-link">{t('common.about')}</Link>
                        <Link to="/contact" className="nav-link">{t('common.contact')}</Link>
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Language Selector */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                            >
                                <FiGlobe className="w-5 h-5" />
                                <span className="uppercase font-medium text-sm">{language}</span>
                            </button>

                            <AnimatePresence>
                                {isLangOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-2 z-50"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    changeLanguage(lang.code);
                                                    setIsLangOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-3 ${language === lang.code ? 'text-primary-500 font-bold bg-primary-50 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300'}`}
                                            >
                                                <span className="text-lg">{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <div className="relative" ref={userRef}>
                                <button
                                    onClick={() => setIsUserOpen(!isUserOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                >
                                    <div className="w-8 h-8 rounded-full bg-zentoura-primary/10 flex items-center justify-center text-zentoura-primary">
                                        <FiUser className="w-5 h-5" />
                                    </div>
                                    <span className="hidden lg:block text-sm font-bold text-gray-700 dark:text-gray-300">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {isUserOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl py-3 z-50 overflow-hidden"
                                        >
                                            <div className="px-5 py-3 border-b dark:border-gray-800 mb-2">
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">{t('common.account')}</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                            </div>

                                            {isAdmin() ? (
                                                <Link
                                                    to="/admin/dashboard"
                                                    onClick={() => setIsUserOpen(false)}
                                                    className="flex items-center space-x-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-zentoura-primary/5 hover:text-zentoura-primary transition-colors"
                                                >
                                                    <div className="p-1.5 bg-zentoura-primary/10 rounded-lg">
                                                        <FiSearch className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold">{t('common.adminPanel')}</span>
                                                </Link>
                                            ) : (
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setIsUserOpen(false)}
                                                    className="flex items-center space-x-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-zentoura-primary/5 hover:text-zentoura-primary transition-colors"
                                                >
                                                    <div className="p-1.5 bg-zentoura-primary/10 rounded-lg">
                                                        <FiSearch className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold">{t('common.myDashboard')}</span>
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => { handleLogout(); setIsUserOpen(false); }}
                                                className="w-full flex items-center space-x-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                            >
                                                <div className="p-1.5 bg-red-500/10 rounded-lg">
                                                    <FiLogOut className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold">{t('common.logout')}</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-500">
                                    {t('common.login')}
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    {t('common.signup')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800"
                >
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/" className="block py-2 hover:text-primary-500">{t('common.home')}</Link>
                        <Link to="/blogs" className="block py-2 hover:text-primary-500">{t('common.blogs')}</Link>
                        <Link to="/hotels" className="block py-2 hover:text-primary-500">{t('common.hotels')}</Link>
                        <Link to="/places" className="block py-2 hover:text-primary-500">{t('common.places')}</Link>
                        <Link to="/activities" className="block py-2 hover:text-primary-500">{t('common.activities')}</Link>
                        <Link to="/about" className="block py-2 hover:text-primary-500">{t('common.about')}</Link>
                        <Link to="/contact" className="block py-2 hover:text-primary-500">{t('common.contact')}</Link>


                        {user ? (
                            <>
                                {isAdmin() ? (
                                    <Link to="/admin/dashboard" className="block py-2 text-primary-500 font-bold">{t('common.adminPanel')}</Link>
                                ) : (
                                    <Link to="/dashboard" className="block py-2 text-primary-500 font-bold">{t('common.myDashboard')}</Link>
                                )}
                                <div className="py-2 text-sm text-gray-600 dark:text-gray-400">
                                    Logged in as {user.name}
                                </div>
                                <button onClick={handleLogout} className="block w-full text-left py-2 text-red-500">
                                    {t('common.logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block py-2">{t('common.login')}</Link>
                                <Link to="/register" className="block py-2 text-primary-500">{t('common.signup')}</Link>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
