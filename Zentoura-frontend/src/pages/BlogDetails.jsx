import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios, { IMAGE_BASE_URL } from '../api/axios';
import Loader from '../components/Loader';
import BlogCard from '../components/BlogCard';
import {
    FiCalendar, FiUser, FiHeart, FiShare2, FiMapPin,
    FiClock, FiMessageSquare, FiFacebook, FiTwitter, FiSend, FiEdit
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';

const BlogDetails = () => {
    const { id } = useParams();
    const { user, isAdmin } = useAuth();
    const [blog, setBlog] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const { t } = useTranslation();

    // Backend handles translation now
    const title = blog?.title;
    const content = blog?.content;
    const category = blog?.category;

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchBlogData();

        const handleLanguageChange = () => {
            fetchBlogData();
        };

        window.addEventListener('languageChange', handleLanguageChange);
        return () => window.removeEventListener('languageChange', handleLanguageChange);
    }, [id]);

    const fetchBlogData = async () => {
        setLoading(true);
        try {
            // Language is automatically added by axios interceptor
            const [blogRes, relatedRes, commentsRes] = await Promise.all([
                axios.get(`/blogs/${id}`),
                axios.get('/blogs', { params: { limit: 3 } }),
                axios.get(`/reviews/blog/${id}`)
            ]);

            const blogData = blogRes.data.data;
            setBlog(blogData);
            setLikeCount(blogData.likes || 0);
            setRelatedPosts(relatedRes.data.data.filter(p => p.id !== parseInt(id)));
            setComments(commentsRes.data.data || []);
        } catch (error) {
            console.error('Error fetching blog details:', error);
            toast.error(t('common.failedToLoadStory'));
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (liked) return;
        setLiked(true);
        setLikeCount(prev => prev + 1);
        try {
            await axios.put(`/blogs/${id}`, { likes: blog.likes + 1 });
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await axios.post('/reviews', {
                blogId: id,
                comment: newComment,
                rating: 5 // Default rating for blog comments
            });
            setComments([response.data.data, ...comments]);
            setNewComment('');
            toast.success(t('blog.commentShared'));
        } catch (error) {
            toast.error(t('common.pleaseLoginToShare'));
        }
    };

    const shareUrl = window.location.href;
    const shareText = blog?.title || 'Check out this amazing story on Zentoura';

    if (loading) return <Loader />;
    if (!blog) return <div className="min-h-screen flex items-center justify-center font-display font-bold text-zentoura-deep">{t('blog.storyNotFound')}</div>;

    const imageUrl = blog.featuredImage
        ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : `${IMAGE_BASE_URL}/${blog.featuredImage}`)
        : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200';

    return (
        <div className="min-h-screen bg-white">
            {/* Immersive Header */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={imageUrl}
                    className="w-full h-full object-cover"
                    alt={blog.title}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <span className="px-4 py-1.5 bg-zentoura-yellow text-zentoura-deepest text-xs font-black uppercase rounded-full shadow-2xl">
                            {category || t('common.travelGuide')}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight drop-shadow-lg">
                            {title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-zentoura-lavender">
                                <span className="flex items-center gap-2"><FiUser className="text-zentoura-yellow" /> {blog.author?.name || t('common.zentouraTeam')}</span>
                                <span className="flex items-center gap-2"><FiCalendar className="text-zentoura-yellow" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-2"><FiClock className="text-zentoura-yellow" /> {blog.readingTime || 5} {t('common.minRead')}</span>
                            </div>

                            {(user?.id === blog.authorId || isAdmin()) && (
                                <Link
                                    to={`/blogs/edit/${blog.id}`}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    <FiEdit className="w-4 h-4" /> {t('common.editStory') || 'Edit Story'}
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Main Content */}
                <div className="lg:col-span-8">
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-body">
                        {content?.split('\n\n').map((para, i) => (
                            <p key={i} className="mb-6">{para}</p>
                        ))}
                    </div>

                    {/* Meta Interactions */}
                    <div className="mt-12 py-8 border-t border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 transition-all duration-300 ${liked ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-500'}`}
                            >
                                <FiHeart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
                                <span className="font-bold">{likeCount}</span>
                            </button>
                            <button
                                onClick={() => setShowComments(!showComments)}
                                className={`flex items-center space-x-2 transition-all duration-300 ${showComments ? 'text-zentoura-deep scale-110' : 'text-gray-400 hover:text-zentoura-deep'}`}
                            >
                                <FiMessageSquare className="w-6 h-6" />
                                <span className="font-bold">{comments.length}</span>
                            </button>
                        </div>

                        {/* Social Share */}
                        <div className="flex items-center space-x-3">
                            <span className="text-xs font-bold uppercase text-gray-400 mr-2">{t('common.shareStory') || 'Share story'}</span>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" className="p-2 hover:bg-zentoura-lavender rounded-full text-zentoura-deep transition-all">
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" className="p-2 hover:bg-zentoura-lavender rounded-full text-zentoura-deep transition-all">
                                <FiTwitter className="w-5 h-5" />
                            </a>
                            <a href={`whatsapp://send?text=${shareText} ${shareUrl}`} className="p-2 hover:bg-zentoura-lavender rounded-full text-zentoura-deep transition-all">
                                <FiSend className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Location Map Section */}
                    {blog.latitude && blog.longitude && (
                        <div className="mt-16">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-display font-bold text-zentoura-deepest flex items-center gap-2">
                                    <FiMapPin className="text-zentoura-deep" /> {t('common.discoverLocation') || 'Discover the Location'}
                                </h2>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${blog.latitude},${blog.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-zentoura-lavender text-zentoura-deep text-xs font-bold rounded-xl hover:bg-zentoura-deep hover:text-white transition-all duration-300 flex items-center gap-2"
                                >
                                    <FiMapPin /> {t('common.findOnMaps') || 'Find on Google Maps'}
                                </a>
                            </div>
                            <div className="h-96 rounded-3xl overflow-hidden shadow-2xl border border-zentoura-deep/10">
                                <iframe
                                    title="location-map"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    src={`https://maps.google.com/maps?q=${blog.latitude},${blog.longitude}&z=15&output=embed`}
                                    className="w-full h-full transition-all duration-700"
                                />
                            </div>
                        </div>
                    )}

                    {/* Comments Section */}
                    <AnimatePresence>
                        {showComments && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="mt-20 border-t border-gray-50 pt-16 space-y-12"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-display font-bold text-zentoura-deepest">{t('common.communityThoughts')}</h2>
                                    <button
                                        onClick={() => setShowComments(false)}
                                        className="text-xs font-black uppercase tracking-widest text-zentoura-deep/40 hover:text-zentoura-deep transition-colors"
                                    >
                                        {t('common.hideReflections')}
                                    </button>
                                </div>

                                <form onSubmit={handleCommentSubmit} className="relative">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder={t('blog.commentPlaceholder')}
                                        className="w-full p-8 bg-white rounded-[2rem] border border-zentoura-deep/10 focus:ring-4 focus:ring-zentoura-lavender outline-none transition-all h-40 text-zentoura-deepest shadow-sm"
                                    />
                                    <div className="absolute right-4 bottom-4">
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-zentoura-yellow text-zentoura-deepest font-black uppercase text-xs rounded-2xl hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
                                        >
                                            <FiSend /> {t('common.postReflection')}
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-6">
                                    <AnimatePresence mode="popLayout">
                                        {comments.map((comment) => (
                                            <motion.div
                                                key={comment.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="flex gap-6 p-8 rounded-[2rem] bg-zentoura-calm/10 border border-white"
                                            >
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zentoura-deep to-zentoura-deepest flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
                                                    {comment.user?.name?.[0] || 'T'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h4 className="font-bold text-zentoura-deepest text-lg">{comment.user?.name || t('common.traveller')}</h4>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-zentoura-deep/30">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-zentoura-deep/70 text-base leading-relaxed">{comment.comment}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {comments.length === 0 && (
                                        <div className="text-center py-12 text-zentoura-deep/30 italic">
                                            {t('blog.firstComment')}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-12">
                    {/* Related Posts */}
                    <div>
                        <h3 className="text-xl font-display font-bold text-zentoura-deepest mb-6">{t('common.moreAdventures')}</h3>
                        <div className="space-y-6">
                            {relatedPosts.map(post => (
                                <RelatedPostCard key={post.id} post={post} t={t} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Extracted RelatedPostCard for specialized translation hooks
const RelatedPostCard = ({ post, t }) => {
    const { translatedText: title } = useDynamicTranslation(post.title);
    const { translatedText: category } = useDynamicTranslation(post.category);

    return (
        <Link
            to={`/blogs/${post.id}`}
            className="flex gap-4 group"
        >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                <img
                    src={post.featuredImage?.startsWith('http') ? post.featuredImage : `${IMAGE_BASE_URL}/${post.featuredImage}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={post.title}
                />
            </div>
            <div>
                <h4 className="font-bold text-zentoura-deepest text-sm line-clamp-2 leading-tight group-hover:text-zentoura-deep transition-colors">
                    {title}
                </h4>
                <span className="text-[10px] text-zentoura-deep/40 font-bold uppercase tracking-wider">{category}</span>
            </div>
        </Link>
    );
};

export default BlogDetails;
