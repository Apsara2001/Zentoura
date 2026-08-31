import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus, FiCamera, FiStar, FiMapPin } from 'react-icons/fi';

const ManagePlaces = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        short_description: '',
        full_description: '',
        latitude: 0,
        longitude: 0,
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchPlaces();
    }, []);

    const fetchPlaces = async () => {
        try {
            const response = await axios.get('/places');
            setPlaces(response.data.data || []);
        } catch (error) {
            toast.error('Error fetching places');
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
            data.append('name', formData.name);
            data.append('location', formData.location);
            data.append('short_description', formData.short_description);
            data.append('full_description', formData.full_description);
            data.append('latitude', formData.latitude);
            data.append('longitude', formData.longitude);

            if (formData.image) {
                data.append('image', formData.image);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editId) {
                await axios.put(`/places/${editId}`, data, config);
                toast.success('Place updated successfully!');
            } else {
                await axios.post('/places', data, config);
                toast.success('Place created successfully!');
            }

            setShowForm(false);
            resetForm();
            fetchPlaces();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving place');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            location: '',
            short_description: '',
            full_description: '',
            rating: 0,
            latitude: 0,
            longitude: 0,
            image: null
        });
        setPreviewUrl('');
        setEditId(null);
    };

    const handleEdit = (place) => {
        setFormData({
            name: place.name,
            location: place.location,
            short_description: place.short_description,
            full_description: place.full_description,
            rating: place.rating,
            latitude: place.latitude,
            longitude: place.longitude,
            image: null
        });

        setPreviewUrl(place.image ? (place.image.startsWith('http') ? place.image : `${IMAGE_BASE_URL}/${place.image}`) : '');
        setEditId(place.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this place?')) {
            try {
                await axios.delete(`/places/${id}`);
                toast.success('Place deleted successfully!');
                fetchPlaces();
            } catch (error) {
                toast.error('Error deleting place');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Places</h1>
                <button
                    onClick={() => {
                        if (showForm) {
                            setShowForm(false);
                            resetForm();
                        } else {
                            setShowForm(true);
                            setEditId(null);
                        }
                    }}
                    className="btn-primary flex items-center space-x-2"
                >
                    <FiPlus /> <span>{showForm ? 'Cancel' : 'Add Place'}</span>
                </button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-2xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Place Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g. Galle Fort"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FiMapPin className="text-zentoura-primary" /> Location
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Ella, Sri Lanka"
                                        className="zentoura-input"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4"> {/* Changed to 2 columns */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.latitude}
                                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.longitude}
                                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Short Description</label>
                                    <textarea
                                        value={formData.short_description}
                                        onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                        className="input-field h-20"
                                        placeholder="Brief summary..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Full Description</label>
                                    <textarea
                                        value={formData.full_description}
                                        onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                        className="input-field h-32"
                                        placeholder="Detailed description..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Cover Image */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-zentoura-deep">Featured Image</label>
                                    <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center group">
                                        {previewUrl ? (
                                            <>
                                                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <FiCamera className="text-white w-8 h-8" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-gray-400 flex flex-col items-center">
                                                <FiCamera className="w-10 h-10 mb-2" />
                                                <span className="text-sm">Upload Photo</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 italic mt-2 text-center">Recommended size: 1200x800px. Max 5MB.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); resetForm(); }}
                                className="flex-1 py-4 text-gray-600 font-bold rounded-xl border-2 border-gray-100 hover:bg-gray-50 transition-all font-display"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="flex-[2] btn-primary py-4 text-lg font-bold rounded-xl shadow-lg shadow-zentoura-primary/20 font-display">
                                {editId ? 'Update Destination' : 'Publish Destination'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="glass-card rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">Preview</th>
                                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">Name</th>
                                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">Location</th>
                                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">Rating</th>
                                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {places.map((place) => (
                                <tr key={place.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                                            <img
                                                src={place.image ? (place.image.startsWith('http') ? place.image : `${IMAGE_BASE_URL}/${place.image}`) : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100'}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">{place.name}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                        <span className="px-2 py-1 bg-zentoura-lavender text-zentoura-deep text-xs rounded-full font-bold">
                                            {place.location}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                            <FiStar className="text-yellow-400 fill-current" /> {place.rating}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button
                                            onClick={() => handleEdit(place)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <FiEdit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(place.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {places.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                                        No places found. Start by adding your first travel destination!
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

export default ManagePlaces;
