import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import { toast } from 'react-toastify';
import { FiUpload, FiMapPin, FiCheck, FiChevronRight, FiArrowLeft } from 'react-icons/fi';
import Loader from '../components/Loader';

const CATEGORIES = ['Beaches', 'Adventure', 'Food & Culture', 'Heritage', 'Nature'];

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        content: '',
        category: 'General',
        tags: '',
        language: 'en',
        latitude: '',
        longitude: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`/blogs/${id}`);
                const blog = response.data.data;

                setFormData({
                    title: blog.title,
                    shortDescription: blog.shortDescription || '',
                    content: blog.content,
                    category: blog.category || 'General',
                    tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
                    language: blog.language || 'en',
                    latitude: blog.latitude || '',
                    longitude: blog.longitude || ''
                });

                if (blog.featuredImage) {
                    const imageUrl = blog.featuredImage.startsWith('http')
                        ? blog.featuredImage
                        : `${IMAGE_BASE_URL}/${blog.featuredImage}`;
                    setImagePreview(imageUrl);
                }
            } catch (error) {
                toast.error('Failed to fetch blog details');
                navigate('/blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'tags') {
                    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                    data.append(key, JSON.stringify(tagsArray));
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (image) {
                data.append('featuredImage', image);
            }

            const response = await axios.put(`/blogs/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                toast.success('Your story has been updated successfully!');
                navigate(`/blogs/${id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update story');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-zentoura-calm/10 pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 md:p-12 rounded-[3rem] shadow-2xl overflow-hidden relative"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-8 flex items-center gap-2 text-zentoura-deep/40 hover:text-zentoura-deep font-black uppercase text-xs transition-colors"
                    >
                        <FiArrowLeft /> Back to Story
                    </button>

                    <div className="mb-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-zentoura-deepest mb-4">
                            Refine Your <span className="gradient-text">Journey</span>
                        </h1>
                        <p className="text-zentoura-deep/60 max-w-lg mx-auto">
                            Update your story to reflect new insights or just to polish your amazing adventure.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Image Upload Area */}
                        <div className="space-y-6">
                            <label className="text-sm font-black uppercase tracking-widest text-zentoura-deep/40 px-6 flex items-center gap-2">
                                <FiUpload className="w-4 h-4" /> Featured Image
                            </label>
                            <div
                                className={`relative h-64 md:h-96 rounded-[3rem] border-2 border-dashed transition-all duration-700 overflow-hidden ${imagePreview ? 'border-transparent shadow-2xl' : 'border-zentoura-deep/10 hover:border-zentoura-deep/30 bg-zentoura-calm/10 hover:bg-zentoura-calm/20'
                                    }`}
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-zentoura-deep/20 backdrop-blur-sm opacity-0 hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                            <label className="px-8 py-3 bg-white text-zentoura-deep font-black uppercase tracking-tighter rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer">
                                                Replace Masterpiece
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center space-y-4 group">
                                        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                            <FiUpload className="w-8 h-8 text-zentoura-deep" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-zentoura-deepest font-black text-lg">Upload Feature Image</p>
                                            <p className="text-sm text-zentoura-deep/40">Drop your story's face here (Max 5MB)</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-sm font-black uppercase tracking-widest text-zentoura-deep/40 px-6 flex items-center gap-2">
                                    Story Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. A Sunset in Ella..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-field-premium"
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-black uppercase tracking-widest text-zentoura-deep/40 px-6 flex items-center gap-2">
                                    Story Category
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-field-premium appearance-none cursor-pointer"
                                    >
                                        <option value="General">General Discovery</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zentoura-deep/20">
                                        <FiChevronRight className="rotate-90 w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-black uppercase tracking-widest text-zentoura-deep/40 px-6 flex items-center gap-2">
                                Short Description
                            </label>
                            <textarea
                                placeholder="A captivating hook for your story..."
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                className="input-field-premium h-28 pt-5 resize-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-black uppercase tracking-widest text-zentoura-deep/40 px-6 flex items-center gap-2">
                                Full Journey Details
                            </label>
                            <textarea
                                placeholder="Pour your heart and soul into the full story..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="input-field-premium h-80 pt-6 resize-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <label className="text-sm font-black uppercase tracking-widest text-zentoura-deep/40 px-6 flex items-center gap-2">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    placeholder="Adventure, Nature..."
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="input-field-premium"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-black uppercase tracking-widest text-zentoura-deep/40 px-6 flex items-center gap-2">
                                    <FiMapPin className="text-zentoura-primary" /> Latitude
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 7.9570"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                    className="input-field-premium"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-black uppercase tracking-widest text-zentoura-deep/40 px-6 flex items-center gap-2">
                                    <FiMapPin className="text-zentoura-primary" /> Longitude
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 80.7603"
                                    value={formData.longitude}
                                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                    className="input-field-premium"
                                />
                            </div>
                        </div>

                        <div className="pt-10">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-6 bg-zentoura-deep text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-zentoura-deep/30 hover:shadow-zentoura-deep/50 hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                {saving ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span className="text-lg">Saving Your Soul...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="w-6 h-6" />
                                        <span className="text-lg">Update Your Story</span>
                                        <FiChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default EditBlog;
