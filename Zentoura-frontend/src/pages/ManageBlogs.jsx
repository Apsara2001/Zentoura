import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus, FiCamera } from 'react-icons/fi';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        content: '',
        category: 'General',
        tags: '',
        language: 'en',
        latitude: '',
        longitude: '',
        isFeatured: false,
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/blogs');
            setBlogs(response.data.data || []);
        } catch (error) {
            toast.error('Error fetching blogs');
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
            data.append('title', formData.title);
            data.append('shortDescription', formData.shortDescription);
            data.append('content', formData.content);
            data.append('category', formData.category);
            data.append('language', formData.language);
            data.append('latitude', formData.latitude);
            data.append('longitude', formData.longitude);
            data.append('isFeatured', formData.isFeatured);

            // Process tags as JSON string for multipart form
            const tagsArray = formData.tags.split(',').map(tag => tag.trim());
            data.append('tags', JSON.stringify(tagsArray));

            if (formData.image) {
                data.append('featuredImage', formData.image);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editId) {
                await axios.put(`/blogs/${editId}`, data, config);
                toast.success('Blog updated!');
            } else {
                await axios.post('/blogs', data, config);
                toast.success('Blog created!');
            }

            setShowForm(false);
            setFormData({ title: '', shortDescription: '', content: '', category: 'General', tags: '', language: 'en', latitude: '', longitude: '', isFeatured: false, image: null });
            setPreviewUrl('');
            setEditId(null);
            fetchBlogs();
        } catch (error) {
            toast.error('Error saving blog');
        }
    };

    const handleEdit = (blog) => {
        setFormData({
            title: blog.title,
            shortDescription: blog.shortDescription || '',
            content: blog.content,
            category: blog.category || 'General',
            tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (typeof blog.tags === 'string' ? blog.tags : ''),
            language: blog.language,
            latitude: blog.latitude || '',
            longitude: blog.longitude || '',
            isFeatured: blog.isFeatured || false,
            image: null
        });
        setPreviewUrl(blog.featuredImage ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : `${IMAGE_BASE_URL}/${blog.featuredImage}`) : '');
        setEditId(blog.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this blog?')) {
            try {
                await axios.delete(`/blogs/${id}`);
                toast.success('Blog deleted!');
                fetchBlogs();
            } catch (error) {
                toast.error('Error deleting blog');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Blogs</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) {
                            setEditId(null);
                            setFormData({ title: '', shortDescription: '', content: '', category: 'General', tags: '', language: 'en', latitude: '', longitude: '', isFeatured: false, image: null });
                            setPreviewUrl('');
                        }
                    }}
                    className="btn-primary flex items-center space-x-2"
                >
                    <FiPlus /> <span>{showForm ? 'Cancel' : 'Add Blog'}</span>
                </button>
            </div>

            {showForm && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-xl mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="General">General</option>
                                        <option value="Beaches">Beaches</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Food & Culture">Food & Culture</option>
                                        <option value="Heritage">Heritage</option>
                                        <option value="Nature">Nature</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Short Description"
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                    className="input-field h-20"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Tags (comma separated)"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Latitude"
                                        value={formData.latitude}
                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Longitude"
                                        value={formData.longitude}
                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Image Upload Area */}
                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-zentoura-deep/40 px-2">Featured Image</label>
                                <div className="relative aspect-video rounded-2xl overflow-hidden bg-zentoura-calm/30 border-2 border-dashed border-zentoura-deep/10 flex flex-col items-center justify-center group">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="text-zentoura-deep/30 flex flex-col items-center">
                                            <FiCamera className="w-12 h-12 mb-2" />
                                            <span className="text-[10px] font-black uppercase">Upload Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-zentoura-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-black text-[10px] uppercase">Select File</span>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 px-2 italic">Max size: 5MB (JPG, PNG, WebP)</p>
                            </div>
                        </div>

                        <textarea
                            placeholder="Full Content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="input-field h-48"
                            required
                        />

                        {/* Admin Map Preview Integration */}
                        {formData.latitude && formData.longitude && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zentoura-deep/40 px-2">
                                    <span>Location Preview</span>
                                    <span className="normal-case font-medium italic text-[10px]">Right-click on Google Maps to get coordinates</span>
                                </div>
                                <div className="h-48 rounded-2xl overflow-hidden border border-zentoura-deep/10 shadow-inner">
                                    <iframe
                                        title="location-preview"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=13&output=embed`}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center space-x-4">
                            <select
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                className="input-field flex-1"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                            </select>
                            <label className="flex items-center space-x-2 cursor-pointer bg-zentoura-calm/50 px-4 py-3 rounded-xl border border-zentoura-deep/5 shadow-sm">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-4 h-4 text-zentoura-deep rounded border-gray-300 focus:ring-zentoura-deep"
                                />
                                <span className="text-xs font-black uppercase tracking-widest text-zentoura-deepest">Featured Post</span>
                            </label>
                        </div>
                        <button type="submit" className="btn-primary w-full py-4 text-lg font-bold">
                            {editId ? 'Update' : 'Create'} Blog
                        </button>
                    </form>
                </motion.div>
            )}

            <div className="glass-card rounded-2xl overflow-hidden border border-white/50 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zentoura-calm/50 border-b border-zentoura-deep/5">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Preview</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Title</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Category</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Date</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zentoura-deep/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zentoura-deep/5">
                            {blogs.map((blog) => {
                                const imageUrl = blog.featuredImage
                                    ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : `${IMAGE_BASE_URL}/${blog.featuredImage}`)
                                    : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100';

                                return (
                                    <tr key={blog.id} className="hover:bg-zentoura-calm/10 transition-colors">
                                        <td className="px-6 py-4 text-left">
                                            <div className="w-16 h-10 rounded-lg overflow-hidden border border-zentoura-deep/10 shadow-sm bg-white">
                                                <img
                                                    src={imageUrl}
                                                    className="w-full h-full object-cover"
                                                    alt={blog.title}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-zentoura-deepest line-clamp-1 max-w-xs">{blog.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-zentoura-lavender text-zentoura-deep text-[10px] rounded-full font-black uppercase tracking-widest">
                                                {blog.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zentoura-deep/60 text-xs font-medium">{new Date(blog.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => handleEdit(blog)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                                                <FiEdit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {blogs.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-zentoura-deep/30 italic">
                                        No stories found. Start chronicling your adventures!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageBlogs;
