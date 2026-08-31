import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus, FiCamera, FiMapPin, FiStar, FiMessageSquare, FiX, FiActivity, FiGlobe } from 'react-icons/fi';

const ManageActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Fun',
        location: '',
        difficulty_level: 'Easy',
        price: '',
        short_description: '',
        full_description: '',
        latitude: '',
        longitude: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [editId, setEditId] = useState(null);

    // Review Management State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const categories = ['Fun', 'Thrilling', 'Adventurous'];
    const difficultyLevels = ['Easy', 'Moderate', 'Challenging'];

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/activities');
            setActivities(response.data.data || []);
        } catch (error) {
            toast.error('Error fetching activities');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'image') {
                    if (formData.image) data.append('image', formData.image);
                } else {
                    data.append(key, formData[key]);
                }
            });

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editId) {
                await axios.put(`/activities/${editId}`, data, config);
                toast.success('Activity updated!');
            } else {
                await axios.post('/activities', data, config);
                toast.success('Activity launched!');
            }

            setShowForm(false);
            resetForm();
            fetchActivities();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving activity');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Fun',
            location: '',
            difficulty_level: 'Easy',
            price: '',
            short_description: '',
            full_description: '',
            latitude: '',
            longitude: '',
            image: null
        });
        setPreviewUrl('');
        setEditId(null);
    };

    const handleEdit = (activity) => {
        setFormData({
            name: activity.name,
            category: activity.category,
            location: activity.location,
            difficulty_level: activity.difficulty_level,
            price: activity.price,
            short_description: activity.short_description,
            full_description: activity.full_description || activity.description,
            latitude: activity.latitude || '',
            longitude: activity.longitude || '',
            image: null
        });
        setPreviewUrl(activity.image ? (activity.image.startsWith('http') ? activity.image : `${IMAGE_BASE_URL}/${activity.image}`) : '');
        setEditId(activity.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Erase this adventure from history? This action is permanent.')) {
            try {
                await axios.delete(`/activities/${id}`);
                toast.success('Activity deleted!');
                fetchActivities();
            } catch (error) {
                toast.error('Error deleting activity');
            }
        }
    };

    // Review Management Logic
    const openReviewModal = async (activity) => {
        setSelectedActivity(activity);
        setShowReviewModal(true);
        setLoadingReviews(true);
        try {
            const response = await axios.get(`/reviews/activity/${activity.id}`);
            setReviews(response.data.data || []);
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setLoadingReviews(false);
        }
    };

    const deleteReview = async (reviewId) => {
        if (window.confirm('Delete this user review?')) {
            try {
                await axios.delete(`/reviews/${reviewId}`);
                toast.success('Review removed');
                setReviews(reviews.filter(r => r.id !== reviewId));
                fetchActivities(); // Refresh to update avg rating
            } catch (error) {
                toast.error('Failed to delete review');
            }
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-white dark:border-gray-800">
                <div>
                    <h1 className="text-4xl font-black text-zentoura-deepest dark:text-white flex items-center gap-3">
                        <FiActivity className="text-zentoura-primary" /> Adventure Ops
                    </h1>
                    <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-xs">Manage your global adventure catalog</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) resetForm();
                    }}
                    className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all ${showForm ? 'bg-zentoura-calm text-zentoura-deepest' : 'bg-zentoura-deepest text-white shadow-xl shadow-zentoura-deep/30'
                        }`}
                >
                    {showForm ? <FiX /> : <FiPlus />}
                    <span>{showForm ? 'Cancel Operation' : 'Launch New Activity'}</span>
                </button>
            </div>

            {/* Registration Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-2xl border border-white dark:border-gray-800"
                    >
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Details Section */}
                                <div className="lg:col-span-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Activity Identity</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border-2 border-transparent focus:border-zentoura-primary focus:bg-white outline-none transition-all font-bold"
                                                placeholder="e.g. Skyline Zipline Adventure"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Base Location</label>
                                            <div className="relative">
                                                <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zentoura-primary" />
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-gray-800/50 p-5 pl-14 rounded-2xl border-2 border-transparent focus:border-zentoura-primary focus:bg-white outline-none transition-all font-bold"
                                                    placeholder="e.g. Ella, Central Highlands"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border-2 border-transparent focus:border-zentoura-primary focus:bg-white outline-none transition-all font-bold"
                                            >
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Difficulty</label>
                                            <select
                                                value={formData.difficulty_level}
                                                onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border-2 border-transparent focus:border-zentoura-primary focus:bg-white outline-none transition-all font-bold"
                                            >
                                                {difficultyLevels.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Price (Rs.)</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border-2 border-transparent focus:border-zentoura-primary focus:bg-white outline-none transition-all font-bold"
                                                placeholder="e.g. 7500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Latitude</label>
                                            <input
                                                type="text"
                                                value={formData.latitude}
                                                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border-2 border-transparent focus:border-zentoura-primary focus:bg-white outline-none transition-all font-bold"
                                                placeholder="6.8724"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Longitude</label>
                                            <input
                                                type="text"
                                                value={formData.longitude}
                                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border-2 border-transparent focus:border-zentoura-primary focus:bg-white outline-none transition-all font-bold"
                                                placeholder="79.8884"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Hook Line (Short Desc)</label>
                                        <input
                                            type="text"
                                            value={formData.short_description}
                                            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border-2 border-transparent focus:border-zentoura-primary focus:bg-white outline-none transition-all font-bold italic"
                                            placeholder="The ultimate rush through the canopy..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Immersive Experience (Full Desc)</label>
                                        <textarea
                                            value={formData.full_description}
                                            onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border-2 border-transparent focus:border-zentoura-primary focus:bg-white outline-none transition-all font-bold h-48"
                                            placeholder="Describe the journey in detail..."
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Media Section */}
                                <div className="lg:col-span-4 space-y-8">
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Cover Media</label>
                                        <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center group border-4 border-dashed border-gray-100 dark:border-gray-700">
                                            {previewUrl ? (
                                                <img src={previewUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Preview" />
                                            ) : (
                                                <div className="text-gray-300 flex flex-col items-center gap-4">
                                                    <FiCamera className="w-20 h-20" />
                                                    <span className="font-black text-sm uppercase tracking-widest">Select Adventure Visual</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-zentoura-deepest/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8 text-center">
                                                <span className="text-white font-black text-xs uppercase tracking-[0.2em] border-2 border-white/30 px-6 py-3 rounded-xl backdrop-blur-sm">Replace Media</span>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-8 bg-zentoura-calm dark:bg-gray-800/50 rounded-[2rem] border border-zentoura-primary/10">
                                        <h4 className="font-black text-zentoura-deepest dark:text-white flex items-center gap-2 mb-4">
                                            <FiGlobe className="text-zentoura-primary" /> Mapping Note
                                        </h4>
                                        <p className="text-xs text-gray-500 font-bold leading-relaxed">
                                            Ensure coordinates are accurate for the dynamic map view in the public details page. You can find these on Google Maps by right-clicking a location.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-6 bg-zentoura-primary text-white font-black rounded-3xl text-2xl shadow-2xl shadow-zentoura-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                                {editId ? 'Apply System Updates' : 'Authorize Global Launch'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List Table */}
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl border border-white dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Experience</th>
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Class & Intel</th>
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Performance</th>
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {activities.map((activity) => (
                                <tr key={activity.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-gray-700 flex-shrink-0">
                                                <img
                                                    src={activity.image ? (activity.image.startsWith('http') ? activity.image : `${IMAGE_BASE_URL}/${activity.image}`) : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=140'}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    alt=""
                                                />
                                            </div>
                                            <div>
                                                <p className="font-black text-zentoura-deepest dark:text-white text-lg">{activity.name}</p>
                                                <p className="text-zentoura-primary text-[10px] font-black uppercase tracking-widest mt-0.5">{activity.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${activity.category === 'Thrilling' ? 'bg-red-500' : activity.category === 'Adventurous' ? 'bg-orange-500' : 'bg-zentoura-primary'}`} />
                                                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{activity.category}</span>
                                            </div>
                                            <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5">
                                                <FiActivity className="w-3 h-3" /> {activity.difficulty_level}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 bg-zentoura-yellow/10 px-3 py-1 rounded-xl">
                                                <FiStar className="text-zentoura-yellow fill-current w-3.5 h-3.5" />
                                                <span className="font-black text-sm">{activity.rating > 0 ? activity.rating : 'N/A'}</span>
                                            </div>
                                            <button
                                                onClick={() => openReviewModal(activity)}
                                                className="flex items-center gap-2 text-gray-400 hover:text-zentoura-primary transition-colors group/rev"
                                            >
                                                <FiMessageSquare className="w-4 h-4 group-hover/rev:scale-110 transition-transform" />
                                                <span className="text-xs font-bold">{activity.reviewCount || 0}</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(activity)}
                                                className="p-3 text-zentoura-deepest dark:text-white hover:bg-zentoura-calm dark:hover:bg-gray-800 rounded-xl transition-all"
                                                title="Edit Blueprint"
                                            >
                                                <FiEdit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(activity.id)}
                                                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                                title="Decommission"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Management Modal */}
            <AnimatePresence>
                {showReviewModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReviewModal(false)}
                            className="absolute inset-0 bg-zentoura-deepest/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white dark:border-gray-800"
                        >
                            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-zentoura-calm dark:bg-gray-800/50">
                                <div>
                                    <h3 className="text-2xl font-black text-zentoura-deepest dark:text-white">Review Audit</h3>
                                    <p className="text-zentoura-primary text-xs font-black uppercase tracking-widest mt-1">{selectedActivity?.name}</p>
                                </div>
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-lg text-gray-400 hover:text-zentoura-deepest transition-all"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6 custom-scrollbar">
                                {loadingReviews ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                                        <div className="w-12 h-12 rounded-full border-4 border-zentoura-primary border-t-transparent animate-spin" />
                                        <span className="font-black text-xs uppercase tracking-[0.2em] text-zentoura-primary">Syncing Intel...</span>
                                    </div>
                                ) : reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="group p-6 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-transparent hover:border-zentoura-primary/20 transition-all">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-8 h-8 rounded-lg bg-zentoura-primary/10 flex items-center justify-center font-black text-zentoura-primary text-sm">
                                                            {review.user?.name?.charAt(0) || 'E'}
                                                        </div>
                                                        <span className="font-bold text-zentoura-deepest dark:text-white">{review.user?.name || 'Explorer'}</span>
                                                        <div className="flex items-center gap-1 bg-zentoura-yellow/10 px-2 py-0.5 rounded-lg ml-2">
                                                            <FiStar className="text-zentoura-yellow fill-current w-3 h-3" />
                                                            <span className="font-black text-[10px]">{review.rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm italic leading-relaxed">"{review.comment}"</p>
                                                    <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest mt-4">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => deleteReview(review.id)}
                                                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                    title="Purge Review"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 space-y-4">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-200">
                                            <FiMessageSquare className="w-8 h-8" />
                                        </div>
                                        <p className="text-gray-400 font-bold italic">No intelligence reports filed yet.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                                    Administrative Audit Trail Active • Unauthorized actions are logged
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageActivities;
