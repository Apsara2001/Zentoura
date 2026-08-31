import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMessageSquare, FiMail, FiUser, FiCalendar, FiCheckCircle,
    FiArchive, FiChevronDown, FiChevronUp, FiFilter, FiSearch
} from 'react-icons/fi';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedIds, setExpandedIds] = useState([]);
    const [stats, setStats] = useState({
        new: 0,
        read: 0,
        total: 0
    });

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const fetchMessages = async () => {
        try {
            const url = filter === 'all' ? '/messages' : `/messages?status=${filter}`;
            const response = await axiosInstance.get(url);
            if (response.data.success) {
                setMessages(response.data.data);

                // Calculate stats based on all messages (or do separate API call)
                const allRes = await axiosInstance.get('/messages');
                const allData = allRes.data.data;
                setStats({
                    new: allData.filter(m => m.status === 'new').length,
                    read: allData.filter(m => m.status === 'read').length,
                    total: allData.length
                });
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await axiosInstance.patch(`/messages/${id}`, { status });
            if (response.data.success) {
                toast.success(`Message marked as ${status}`);
                fetchMessages();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const toggleExpand = (id) => {
        if (expandedIds.includes(id)) {
            setExpandedIds(expandedIds.filter(idx => idx !== id));
        } else {
            setExpandedIds([...expandedIds, id]);
            // If marking as read when expanding
            const msg = messages.find(m => m.id === id);
            if (msg && msg.status === 'new') {
                updateStatus(id, 'read');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'read': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h2>
                    <p className="text-gray-600 dark:text-gray-400">View and manage customer inquiries</p>
                </div>

                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border dark:border-gray-700">
                    {['all', 'new', 'read', 'archived'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">New Messages</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.new}</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FiMessageSquare className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">Read</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.read}</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FiCheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium uppercase tracking-wider">Total</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FiMail className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border dark:border-gray-700 shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiMessageSquare className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No messages found</h3>
                        <p className="text-gray-600 dark:text-gray-400">There are no messages in the {filter} category.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border transition-all ${expandedIds.includes(msg.id)
                                ? 'ring-2 ring-indigo-500 border-transparent'
                                : 'hover:border-indigo-300 dark:border-gray-700'
                                }`}
                        >
                            <div
                                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                                onClick={() => toggleExpand(msg.id)}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(msg.status)}`}>
                                            {msg.status}
                                        </span>
                                        <h4 className={`text-lg font-bold ${msg.status === 'new' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {msg.subject}
                                        </h4>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <FiUser className="w-4 h-4" />
                                            <span>{msg.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FiMail className="w-4 h-4" />
                                            <span>{msg.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FiCalendar className="w-4 h-4" />
                                            <span>{formatDate(msg.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        {msg.status === 'archived' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateStatus(msg.id, 'read');
                                                }}
                                                className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                                title="Unarchive"
                                            >
                                                <FiCheckCircle className="w-5 h-5" />
                                            </button>
                                        )}
                                        {msg.status === 'read' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateStatus(msg.id, 'new');
                                                }}
                                                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Mark as New (Unread)"
                                            >
                                                <FiMessageSquare className="w-5 h-5" />
                                            </button>
                                        )}
                                        {msg.status !== 'archived' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateStatus(msg.id, 'archived');
                                                }}
                                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title="Archive"
                                            >
                                                <FiArchive className="w-5 h-5" />
                                            </button>
                                        )}
                                        {msg.status === 'new' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateStatus(msg.id, 'read');
                                                }}
                                                className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                                title="Mark as Read"
                                            >
                                                <FiCheckCircle className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-gray-400">
                                        {expandedIds.includes(msg.id) ? <FiChevronUp className="w-6 h-6" /> : <FiChevronDown className="w-6 h-6" />}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedIds.includes(msg.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
                                    >
                                        <div className="p-6">
                                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                                {msg.message}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageMessages;
