import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiCheck, FiArrowLeft, FiCamera, FiLock, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const Profile = () => {
    const { user, updateUser } = useAuth();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        bio: user?.bio || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put('/auth/profile', formData);
            if (response.data.success) {
                updateUser(response.data.data);
                toast.success('Profile updated successfully!');

                // Optional: redirect to dashboard
                setTimeout(() => navigate('/dashboard'), 1500);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('New passwords do not match');
        }

        if (passwordData.newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setPasswordLoading(true);

        try {
            const response = await axios.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (response.data.success) {
                toast.success('Password updated successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden"
                >
                    <div className="bg-zentoura-deep p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
                            >
                                <FiArrowLeft /> Back to Dashboard
                            </button>
                            <h1 className="text-3xl md:text-5xl font-display font-bold">Manage <span className="text-zentoura-yellow">Profile</span></h1>
                            <p className="text-white/70 mt-4 max-w-md">Update your personal information to enhance your Zentoura experience.</p>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    </div>

                    <div className="p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                        <FiUser className="text-zentoura-deep" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-zentoura-deep/10 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-3 opacity-60">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                        <FiMail className="text-zentoura-deep" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        className="w-full px-6 py-4 bg-gray-100 border-2 border-transparent rounded-2xl outline-none cursor-not-allowed font-medium"
                                        disabled
                                    />
                                    <p className="text-[10px] text-gray-400 ml-4 italic">Email cannot be changed.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                        <FiPhone className="text-zentoura-deep" /> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+94 7X XXX XXXX"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-zentoura-deep/10 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                        <FiMapPin className="text-zentoura-deep" /> Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="City, Country"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-zentoura-deep/10 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                    <FiFileText className="text-zentoura-deep" /> Bio / About You
                                </label>
                                <textarea
                                    name="bio"
                                    rows="4"
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-zentoura-deep/10 focus:bg-white rounded-2xl outline-none transition-all font-medium resize-none"
                                />
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-zentoura-deep text-white font-bold rounded-2xl shadow-xl shadow-zentoura-deep/20 hover:bg-zentoura-deepest transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <FiCheck className="text-xl" />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-20 pt-12 border-t border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-zentoura-deep flex items-center gap-3">
                                        <FiShield className="text-zentoura-yellow" /> Security & <span className="text-zentoura-yellow">Password</span>
                                    </h2>
                                    <p className="text-gray-500 mt-2">Manage your account security and update your password.</p>
                                </div>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                            <FiLock className="text-zentoura-deep" /> Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-zentoura-deep/10 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                            <FiLock className="text-zentoura-deep" /> New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-zentoura-deep/10 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                            <FiLock className="text-zentoura-deep" /> Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-zentoura-deep/10 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className="w-full md:w-auto px-12 py-5 bg-white border-2 border-zentoura-deep text-zentoura-deep font-bold rounded-2xl hover:bg-zentoura-deep hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                                    >
                                        {passwordLoading ? (
                                            <div className="w-6 h-6 border-4 border-zentoura-deep/20 border-t-zentoura-deep rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <FiShield className="text-xl group-hover:text-white" />
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
