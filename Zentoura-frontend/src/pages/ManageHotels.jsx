import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus, FiCamera, FiStar, FiMapPin, FiList } from 'react-icons/fi';

const ManageHotels = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        pricePerNight: '',
        amenities: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            // Force English to ensure we are editing source content
            const response = await axios.get('/hotels', { params: { language: 'en' } });
            setHotels(response.data.data || []);
        } catch (error) {
            toast.error('Error fetching hotels');
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
            data.append('description', formData.description);
            data.append('pricePerNight', formData.pricePerNight);

            // Convert comma-separated string to JSON string for backend
            const amenitiesArray = formData.amenities.split(',').map(item => item.trim()).filter(Boolean);
            data.append('amenities', JSON.stringify(amenitiesArray));

            if (formData.image) {
                data.append('image', formData.image);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editId) {
                await axios.put(`/hotels/${editId}`, data, config);
                toast.success('Hotel updated successfully!');
            } else {
                await axios.post('/hotels', data, config);
                toast.success('Hotel created successfully!');
            }

            setShowForm(false);
            setFormData({ name: '', location: '', description: '', pricePerNight: '', amenities: '', image: null });
            setPreviewUrl('');
            setEditId(null);
            fetchHotels();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving hotel');
        }
    };

    const handleEdit = (hotel) => {
        setFormData({
            name: hotel.name,
            location: hotel.location,
            description: hotel.description,
            pricePerNight: hotel.pricePerNight,
            amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : '',
            image: null
        });
        setPreviewUrl(hotel.image ? (hotel.image.startsWith('http') ? hotel.image : `${IMAGE_BASE_URL}/${hotel.image}`) : '');
        setEditId(hotel.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hotel?')) {
            try {
                await axios.delete(`/hotels/${id}`);
                toast.success('Hotel deleted successfully!');
                fetchHotels();
            } catch (error) {
                toast.error('Error deleting hotel');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-black text-zentoura-deepest dark:text-white tracking-tight">Manage Hotels</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) {
                            setEditId(null);
                            setFormData({ name: '', location: '', description: '', pricePerNight: '', amenities: '', image: null });
                            setPreviewUrl('');
                        }
                    }}
                    className="btn-primary flex items-center space-x-2 shadow-lg shadow-zentoura-primary/20"
                >
                    <FiPlus className="text-lg" /> <span>{showForm ? 'Cancel' : 'Add Hotel'}</span>
                </button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 rounded-[2rem] mb-12 border border-white/40 shadow-xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zentoura-deep/50 ml-2">Hotel Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input-field"
                                            placeholder="e.g. Grand Hotel"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zentoura-deep/50 ml-2">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="input-field"
                                            placeholder="e.g. Colombo, Sri Lanka"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zentoura-deep/50 ml-2">Price / Night (Rs.)</label>
                                        <input
                                            type="number"
                                            value={formData.pricePerNight}
                                            onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                                            className="input-field"
                                            placeholder="150"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zentoura-deep/50 ml-2">Amenities</label>
                                        <input
                                            type="text"
                                            value={formData.amenities}
                                            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                                            className="input-field"
                                            placeholder="WiFi, Pool, Gym, Parking"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zentoura-deep/50 ml-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-field h-40 resize-none"
                                        placeholder="Enter detailed description..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-zentoura-deep/50 ml-2">Featured Image</label>
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/50 border-2 border-dashed border-zentoura-deep/10 flex flex-col items-center justify-center group transition-colors hover:border-zentoura-primary/30 hover:bg-white/80">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="text-zentoura-deep/30 flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-zentoura-deep/5 flex items-center justify-center">
                                                <FiCamera className="w-8 h-8" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Upload Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-zentoura-deepest/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-white font-black text-xs uppercase tracking-widest border border-white/30 px-4 py-2 rounded-full">Select File</span>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 px-3 italic">Recommended: 1200x800px. Max 5MB.</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-zentoura-deep/5">
                            <button type="submit" className="btn-primary py-4 px-12 text-lg font-black shadow-xl shadow-zentoura-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                {editId ? 'Update Hotel' : 'Create Hotel'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="glass-card rounded-[2rem] overflow-hidden border border-white/50 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zentoura-calm/50 border-b border-zentoura-deep/5">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Preview</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Hotel Details</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Price/Night</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zentoura-deep/40">Rating</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zentoura-deep/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zentoura-deep/5">
                            {hotels.map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-white/40 transition-colors group">
                                    <td className="px-8 py-5 w-[140px]">
                                        <div className="w-24 h-16 rounded-xl overflow-hidden border border-white shadow-sm bg-gray-100 relative group-hover:scale-110 transition-transform">
                                            <img
                                                src={hotel.image ? (hotel.image.startsWith('http') ? hotel.image : `${IMAGE_BASE_URL}/${hotel.image}`) : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-black text-zentoura-deepest text-lg">{hotel.name}</span>
                                            <div className="flex items-center gap-1.5 text-zentoura-deep/60 text-sm font-medium">
                                                <FiMapPin className="text-zentoura-primary" /> {hotel.location}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-black text-zentoura-primary text-lg">Rs. {hotel.pricePerNight}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 bg-yellow-50 w-fit px-3 py-1 rounded-full border border-yellow-100">
                                            <FiStar className="text-yellow-400 fill-current w-4 h-4" />
                                            <span className="font-bold text-yellow-700">{hotel.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => navigate(`/admin/hotels/${hotel.id}/rooms`)}
                                                className="p-2.5 text-zentoura-primary hover:bg-zentoura-primary/10 rounded-xl transition-all hover:scale-110"
                                                title="Manage Rooms"
                                            >
                                                <FiList className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(hotel)}
                                                className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
                                                title="Edit"
                                            >
                                                <FiEdit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(hotel.id)}
                                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                                                title="Delete"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {hotels.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-zentoura-deep/30">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-zentoura-deep/5 flex items-center justify-center">
                                                <FiList className="w-8 h-8 opacity-50" />
                                            </div>
                                            <div className="text-lg font-bold">No hotels found</div>
                                            <p className="text-sm">Start building your hospitality portfolio!</p>
                                        </div>
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

export default ManageHotels;
