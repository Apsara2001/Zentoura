import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';

const Footer = () => {
    const { t } = useTranslation();
    const { translatedText: translatedActivities } = useDynamicTranslation(t('activites'));
    const { translatedText: translatedPlaces } = useDynamicTranslation(t('places'));
    return (
        <footer className="bg-zentoura-dreamy text-zentoura-deepest border-t border-zentoura-deep/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* About */}
                    <div className="space-y-4">
                        <h3 className="text-zentoura-deep text-2xl font-display font-bold">Zentoura</h3>
                        <p className="text-sm leading-relaxed text-zentoura-deepest/80">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-zentoura-deepest font-display font-semibold mb-6">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/blogs" className="hover:text-zentoura-deep transition-all duration-300 flex items-center group text-zentoura-deepest"><span className="w-0 group-hover:w-2 h-0.5 bg-zentoura-deep mr-0 group-hover:mr-2 transition-all"></span>{t('common.blogs')}</Link></li>
                            <li><Link to="/hotels" className="hover:text-zentoura-deep transition-all duration-300 flex items-center group text-zentoura-deepest"><span className="w-0 group-hover:w-2 h-0.5 bg-zentoura-deep mr-0 group-hover:mr-2 transition-all"></span>{t('common.hotels')}</Link></li>
                            <li><Link to="/places" className="hover:text-zentoura-deep transition-all duration-300 flex items-center group text-zentoura-deepest"><span className="w-0 group-hover:w-2 h-0.5 bg-zentoura-deep mr-0 group-hover:mr-2 transition-all"></span>{translatedPlaces}</Link></li>
                            <li><Link to="/activities" className="hover:text-zentoura-deep transition-all duration-300 flex items-center group text-zentoura-deepest"><span className="w-0 group-hover:w-2 h-0.5 bg-zentoura-deep mr-0 group-hover:mr-2 transition-all"></span>{translatedActivities}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-zentoura-deepest font-display font-semibold mb-6">{t('footer.contact')}</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center space-x-3 group">
                                <div className="p-2 bg-zentoura-deep/10 rounded-lg text-zentoura-deep group-hover:bg-zentoura-deep group-hover:text-white transition-all">
                                    <FiMail className="w-4 h-4" />
                                </div>
                                <span className="text-zentoura-deepest">info@zentoura.com</span>
                            </li>
                            <li className="flex items-center space-x-3 group">
                                <div className="p-2 bg-zentoura-deep/10 rounded-lg text-zentoura-deep group-hover:bg-zentoura-deep group-hover:text-white transition-all">
                                    <FiPhone className="w-4 h-4" />
                                </div>
                                <span className="text-zentoura-deepest">+94 77 123 4567</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-zentoura-deepest font-display font-semibold mb-6">{t('footer.followUs')}</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="p-3 bg-zentoura-deep/10 rounded-xl hover:bg-zentoura-deep hover:text-white transition-all duration-300 transform hover:-translate-y-1 text-zentoura-deepest">
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 bg-zentoura-deep/10 rounded-xl hover:bg-zentoura-deep hover:text-white transition-all duration-300 transform hover:-translate-y-1 text-zentoura-deepest">
                                <FiTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 bg-zentoura-deep/10 rounded-xl hover:bg-zentoura-deep hover:text-white transition-all duration-300 transform hover:-translate-y-1 text-zentoura-deepest">
                                <FiInstagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zentoura-deep/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-zentoura-deepest/60">
                    <p className="text-zentoura-deepest/80">&copy; {new Date().getFullYear()} Zentoura. {t('footer.craftedMsg')}</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-zentoura-deep transition-colors text-zentoura-deepest/80">{t('footer.privacyPolicy')}</a>
                        <a href="#" className="hover:text-zentoura-deep transition-colors text-zentoura-deepest/80">{t('footer.termsOfService')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
