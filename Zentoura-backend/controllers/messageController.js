const Message = require('../models/Message');

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create message
        const newMessage = await Message.create({
            name,
            email,
            subject,
            message,
            status: 'new'
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
exports.getAllMessages = async (req, res) => {
    try {
        const { status } = req.query;

        // Build query filter
        const whereClause = {};
        if (status && ['new', 'read', 'archived'].includes(status)) {
            whereClause.status = status;
        }

        // Fetch messages
        const messages = await Message.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};

// @desc    Update message status
// @route   PATCH /api/messages/:id
// @access  Private/Admin
exports.updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!status || !['new', 'read', 'archived'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: new, read, archived'
            });
        }

        // Find message
        const message = await Message.findByPk(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Update status
        message.status = status;
        await message.save();

        res.status(200).json({
            success: true,
            message: 'Message status updated successfully',
            data: message
        });
    } catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update message status',
            error: error.message
        });
    }
};
