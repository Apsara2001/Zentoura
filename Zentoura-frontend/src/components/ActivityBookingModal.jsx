import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiUsers, FiCheck } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';

const ActivityBookingModal = ({ activity, isOpen, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();
    const { translatedText: translatedName } = useDynamicTranslation(activity?.name);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            guests: 1,
            bookingDate: '',
            paymentMethod: 'credit',
            cardType: 'visa',
            cardNumber: '',
            expiryDate: '',
            cvc: ''
        }
    });

    const guests = watch('guests');

    useEffect(() => {
        if (activity) {
            setTotalPrice(activity.price * (guests || 1));
        }
    }, [guests, activity]);

    useEffect(() => {
        if (!isOpen) {
            reset();
            setStep(1);
        }
    }, [isOpen, reset]);

    const onSubmit = async (data) => {
        if (!user) {
            toast.error(t('common.pleaseLoginToBookAdventure') || 'Please login to book an adventure');
            navigate('/login');
            return;
        }

        try {
            setIsSubmitting(true);
            toast.info("Working right now...", {
                position: "top-center",
                autoClose: 2000,
            });

            await axios.post('/activity-bookings', {
                activityId: activity.id,
                bookingDate: data.bookingDate,
                guests: parseInt(data.guests),
                paymentMethod: data.paymentMethod,
                cardType: data.cardType,
                cardNumber: data.cardNumber,
                expiryDate: data.expiryDate,
                cvc: data.cvc
            });

            toast.success(t('common.bookingConfirmed') || 'Booking confirmed! Get ready for adventure!');
            onClose();
            // TODO: Navigate to success page or bookings page
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.response?.data?.message || t('common.failedToBookActivity'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white dark:border-gray-800 max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="relative h-32 bg-zentoura-primary overflow-hidden">
                        <div className="absolute inset-0 bg-black/20" />
                        <img
                            src={activity.image}
                            alt={translatedName}
                            className="w-full h-full object-cover mix-blend-overlay"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                        >
                            <FiX size={24} />
                        </button>
                        <div className="absolute bottom-6 left-8 text-white">
                            <span className="text-xs font-black uppercase tracking-widest opacity-80">{t('common.bookAdventure')}</span>
                            <h2 className="text-3xl font-black">{translatedName}</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                {/* Date Selection */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500">
                                        <FiCalendar className="text-zentoura-primary" /> {t('common.selectDate')}
                                    </label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]} // Allow today? Or tomorrow? Using today for now.
                                        {...register('bookingDate', { required: t('common.pleaseSelectDate') })}
                                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-zentoura-primary outline-none font-bold text-gray-700 dark:text-gray-200"
                                    />
                                    {errors.bookingDate && <p className="text-red-500 text-sm font-bold">{errors.bookingDate.message}</p>}
                                </div>

                                {/* Guests Selection */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500">
                                        <FiUsers className="text-zentoura-primary" /> {t('common.explorers')}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            min="1"
                                            {...register('guests', {
                                                required: t('common.atLeastOneGuest'),
                                                min: { value: 1, message: t('common.minimumOneExplorer') }
                                            })}
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-zentoura-primary outline-none font-bold text-gray-700 dark:text-gray-200"
                                        />
                                        <div className="whitespace-nowrap font-black text-lg text-gray-400">
                                            × Rs. {activity.price}
                                        </div>
                                    </div>
                                    {errors.guests && <p className="text-red-500 text-sm font-bold">{errors.guests.message}</p>}
                                </div>

                                {/* Payment Method Selection */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500">
                                            Payment Method
                                        </label>
                                        <select
                                            {...register('paymentMethod')}
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-zentoura-primary outline-none font-bold text-gray-700 dark:text-gray-200"
                                        >
                                            <option value="credit">Credit Card</option>
                                            <option value="debit">Debit Card</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500">
                                            Card Type
                                        </label>
                                        <select
                                            {...register('cardType')}
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-zentoura-primary outline-none font-bold text-gray-700 dark:text-gray-200"
                                        >
                                            <option value="visa">Visa</option>
                                            <option value="master">Master Card</option>
                                            <option value="Amex">Amex</option>
                                            <option value="LankaPay">LankaPay</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            {...register('cardNumber', { required: true })}
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-zentoura-primary outline-none font-bold text-gray-700 dark:text-gray-200"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                {...register('expiryDate', { required: true })}
                                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-zentoura-primary outline-none font-bold text-gray-700 dark:text-gray-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500">
                                                CVC
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                {...register('cvc', { required: true })}
                                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-zentoura-primary outline-none font-bold text-gray-700 dark:text-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Total Price */}
                                <div className="bg-zentoura-calm dark:bg-gray-800 p-6 rounded-2xl flex justify-between items-center">
                                    <span className="text-sm font-black uppercase tracking-widest text-gray-500">{t('common.totalPrice')}</span>
                                    <div className="text-3xl font-black text-zentoura-deepest dark:text-white">
                                        Rs. {totalPrice.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-zentoura-deepest text-white font-black rounded-2xl shadow-xl shadow-zentoura-deep/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-70 disabled:grayscale"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {t('common.confirmBooking')} <FiCheck />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div >
        </AnimatePresence >
    );
};

export default ActivityBookingModal;
