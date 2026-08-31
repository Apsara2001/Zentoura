const { Blog, Translation, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all blogs with pagination and search
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const language = req.query.language || 'en'; // Default to English
        const category = req.query.category || '';
        const isFeatured = req.query.isFeatured;

        const whereClause = {};
        if (search) {
            whereClause.title = { [Op.like]: `%${search}%` };
        }
        // Remove language filter from whereClause as multi-lingual support is handled dynamically
        // if (language) {
        //     whereClause.language = language;
        // }
        if (category) {
            whereClause.category = category;
        }
        if (isFeatured !== undefined) {
            whereClause.isFeatured = isFeatured === 'true';
        }

        const { count, rows } = await Blog.findAndCountAll({
            where: whereClause,
            distinct: true,
            limit,
            offset,
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Translate content if language is not English
        let startTranslation = Date.now();
        let translatedRows = rows;

        if (language && language !== 'en') {
            const { translateText } = require('../utils/translationService');

            translatedRows = await Promise.all(rows.map(async (blog) => {
                const plainBlog = blog.get({ plain: true });

                try {
                    // Ensure shortDescription exists, if not derive from content
                    let shortDescToTranslate = plainBlog.shortDescription;
                    if (!shortDescToTranslate && plainBlog.content) {
                        shortDescToTranslate = plainBlog.content.substring(0, 150) + '...';
                    }

                    // Translate title, content, and category
                    const [translatedTitle, translatedShortDesc, translatedCategory] = await Promise.all([
                        translateText(plainBlog.title, language),
                        translateText(shortDescToTranslate, language),
                        translateText(plainBlog.category, language)
                    ]);

                    return {
                        ...plainBlog,
                        title: translatedTitle,
                        shortDescription: translatedShortDesc,
                        category: translatedCategory,
                        originalLanguage: 'en',
                        displayLanguage: language
                    };
                } catch (err) {
                    console.error(`Translation failed for blog ${blog.id}:`, err);
                    return plainBlog;
                }
            }));
        }

        res.json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: translatedRows
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlog = async (req, res, next) => {
    try {
        const { language } = req.query;

        const blog = await Blog.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        let blogData = blog.get({ plain: true });

        // Translate if language is requested and not English
        if (language && language !== 'en') {
            const { translateText } = require('../utils/translationService');
            try {
                const [translatedTitle, translatedContent, translatedShortDesc, translatedCategory] = await Promise.all([
                    translateText(blogData.title, language),
                    translateText(blogData.content, language),
                    translateText(blogData.shortDescription, language),
                    translateText(blogData.category, language)
                ]);

                blogData = {
                    ...blogData,
                    title: translatedTitle,
                    content: translatedContent,
                    shortDescription: translatedShortDesc,
                    category: translatedCategory,
                    originalLanguage: 'en',
                    displayLanguage: language
                };

            } catch (err) {
                console.error(`Translation failed for blog ${blog.id}:`, err);
                // Return original on failure
            }
        }

        res.json({
            success: true,
            data: blogData
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res, next) => {
    try {
        const { title, shortDescription, content, category, tags, language, latitude, longitude, isFeatured, translations } = req.body;
        const featuredImage = req.file ? req.file.filename : null;

        const blog = await Blog.create({
            title,
            shortDescription,
            content,
            category: category || 'General',
            tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
            language: language || 'en',
            latitude,
            longitude,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            authorId: req.user.id,
            featuredImage
        });

        // Create translations if provided
        if (translations && Array.isArray(translations)) {
            const translationData = translations.map(t => ({
                blogId: blog.id,
                language: t.language,
                translatedTitle: t.title,
                translatedContent: t.content
            }));
            await Translation.bulkCreate(translationData);
        }

        const createdBlog = await Blog.findByPk(blog.id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Translation,
                    as: 'translations'
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: createdBlog
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check ownership or admin status
        if (blog.authorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this blog'
            });
        }

        const { title, shortDescription, content, category, tags, language, latitude, longitude, isFeatured } = req.body;
        const featuredImage = req.file ? req.file.filename : blog.featuredImage;

        await blog.update({
            title: title || blog.title,
            shortDescription: shortDescription !== undefined ? shortDescription : blog.shortDescription,
            content: content || blog.content,
            category: category || blog.category,
            tags: tags !== undefined ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : blog.tags,
            language: language || blog.language,
            latitude: latitude !== undefined ? latitude : blog.latitude,
            longitude: longitude !== undefined ? longitude : blog.longitude,
            isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : blog.isFeatured,
            featuredImage
        });

        const updatedBlog = await Blog.findByPk(blog.id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Translation,
                    as: 'translations'
                }
            ]
        });

        res.json({
            success: true,
            data: updatedBlog
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check ownership or admin status
        if (blog.authorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this blog'
            });
        }

        await blog.destroy();

        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
};
