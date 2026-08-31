import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus, FiCamera, FiArrowLeft, FiUsers, FiMaximize } from 'react-icons/fi';

const ManageRooms = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        pricePerNight: '',
        bedrooms: '1',
        maxGuests: '2',
        totalRooms: '1',
        amenities: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchHotelAndRooms();
    }, [hotelId]);

    const fetchHotelAndRooms = async () => {
        try {
            const [hotelRes, roomsRes] = await Promise.all([
                axios.get(`/hotels/${hotelId}`),
                axios.get(`/hotels/${hotelId}/rooms`)
            ]);
            setHotel(hotelRes.data.data);

            // Defensively parse amenities if they are strings
            const processedRooms = (roomsRes.data.data || []).map(room => {
                let amenities = room.amenities;
                if (typeof amenities === 'string') {
                    try { amenities = JSON.parse(amenities); } catch (e) { amenities = []; }
                }

                return {
                    ...room,
                    image: room.image || null,
                    amenities: Array.isArray(amenities) ? amenities : []
                };
            });

            setRooms(processedRooms);
        } catch (error) {
            toast.error('Error fetching data');
            navigate('/admin/hotels');
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
            data.append('pricePerNight', formData.pricePerNight);
            data.append('bedrooms', formData.bedrooms);
            data.append('maxGuests', formData.maxGuests);
            data.append('totalRooms', formData.totalRooms);

            const amenitiesArray = formData.amenities.split(',').map(item => item.trim()).filter(Boolean);
            data.append('amenities', JSON.stringify(amenitiesArray));

            // Append image
            if (formData.image) {
                data.append('image', formData.image);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editId) {
                await axios.put(`/rooms/${editId}`, data, config);
                toast.success('Room updated successfully!');
            } else {
                await axios.post(`/hotels/${hotelId}/rooms`, data, config);
                toast.success('Room created successfully!');
            }

            setShowForm(false);
            resetForm();
            fetchHotelAndRooms();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving room');
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', pricePerNight: '', bedrooms: '1', maxGuests: '2', totalRooms: '1', amenities: '', image: null });
        setPreviewUrl('');
        setEditId(null);
    };

    const handleEdit = (room) => {
        setFormData({
            name: room.name,
            pricePerNight: room.pricePerNight,
            bedrooms: room.bedrooms,
            maxGuests: room.maxGuests,
            totalRooms: room.totalRooms,
            amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
            image: null
        });

        setPreviewUrl(room.image ? (room.image.startsWith('http') ? room.image : `${IMAGE_BASE_URL}/${room.image}`) : '');
        setEditId(room.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await axios.delete(`/rooms/${id}`);
                toast.success('Room deleted successfully!');
                fetchHotelAndRooms();
            } catch (error) {
                toast.error('Error deleting room');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <button
                        onClick={() => navigate('/admin/hotels')}
                        className="flex items-center text-gray-500 hover:text-zentoura-primary mb-2 transition-colors"
                    >
                        <FiArrowLeft className="mr-1" /> Back to Hotels
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Rooms for <span className="text-zentoura-primary">{hotel?.name}</span>
                    </h1>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) resetForm();
                    }}
                    className="flex items-center space-x-2 px-6 py-2 bg-zentoura-deep text-white rounded-xl font-bold hover:bg-zentoura-deepest transition-colors"
                >
                    <FiPlus /> <span>{showForm ? 'Cancel' : 'Add Room'}</span>
                </button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Room Type</label>
                                    <select
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                        required
                                    >
                                        <option value="">Select room type...</option>
                                        <option value="Standard Room">Standard Room</option>
                                        <option value="Deluxe Room">Deluxe Room</option>
                                        <option value="Suite Room">Suite Room</option>
                                        <option value="Family Room">Family Room</option>
                                        <option value="Executive Suite">Executive Suite</option>
                                        <option value="Presidential Suite">Presidential Suite</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Price / Night (Rs)</label>
                                        <input
                                            type="number"
                                            value={formData.pricePerNight}
                                            onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                            placeholder="5000"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Total Rooms</label>
                                        <input
                                            type="number"
                                            value={formData.totalRooms}
                                            onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                            placeholder="5"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Bedrooms</label>
                                        <input
                                            type="number"
                                            value={formData.bedrooms}
                                            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                            placeholder="1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Max Guests</label>
                                        <input
                                            type="number"
                                            value={formData.maxGuests}
                                            onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                            placeholder="2"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Amenities (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.amenities}
                                        onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-zentoura-primary"
                                        placeholder="AC, TV, Balcony, Bathtub"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-semibold mb-2">Room Image</label>
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="text-gray-400 flex flex-col items-center">
                                            <FiCamera className="w-12 h-12 mb-2" />
                                            <span>Upload a photo</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 italic">Recommended size: 1200x800px. Max 5MB.</p>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-zentoura-deep text-white font-bold rounded-xl shadow-lg hover:bg-zentoura-deepest transition-colors">
                            {editId ? 'Update Room' : 'Create Room'}
                        </button>
                    </form>
                </motion.div>
            )}

            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700">Room Details & Images</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Configuration</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Pricing</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Inventory</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rooms.map((room) => (
                                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-14 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                                                {room.image ? (
                                                    <img
                                                        src={room.image.startsWith('http') ? room.image : `${IMAGE_BASE_URL}/${room.image}`}
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <FiCamera />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-bold text-gray-800 text-lg">{room.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1"><FiUsers size={14} /> {room.maxGuests} Guests</span>
                                            <span className="flex items-center gap-1"><FiMaximize size={14} /> {room.bedrooms} Bed</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-zentoura-primary">Rs. {room.pricePerNight}</td>
                                    <td className="px-6 py-4 text-gray-600">{room.totalRooms}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button
                                            onClick={() => handleEdit(room)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <FiEdit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {rooms.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                        No rooms found. Add some rooms to start accepting bookings!
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

export default ManageRooms;
