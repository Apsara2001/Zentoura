const jwt = require('jsonwebtoken');
const { User, sequelize } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Robust logging helper
const logToFile = (message) => {
    try {
        const logMsg = `[${new Date().toISOString()}] ${message}\n`;
        fs.appendFileSync(path.join(__dirname, '../login_debug.log'), logMsg);
    } catch (err) {
        console.error('Failed to write to login_debug.log:', err.message);
    }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        logToFile(`Registration Attempt: email="${email}", name="${name}", role="${role || 'user'}"`);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logToFile(`Registration Validation Errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            logToFile(`Registration Failed: User already exists with email "${email}"`);
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        logToFile(`Registration Success: User "${email}" created (ID: ${user.id}, Role: ${user.role})`);

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)
            }
        });
    } catch (error) {
        logToFile(`Registration Error (Exception): ${error.message}`);
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        logToFile(`Login Attempt: email="${email}", password="${password ? '****' : 'MISSING'}"`);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logToFile(`Login Validation Errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Find user by email or name
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { name: email }
                ]
            }
        });

        if (!user) {
            logToFile(`Login Failed: User not found for email/name "${email}"`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            logToFile(`Login Failed: Incorrect password for user "${email}"`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        logToFile(`Login Success: User "${email}" (ID: ${user.id}, Role: ${user.role})`);

        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)
            }
        });
    } catch (error) {
        logToFile(`Login Error (Exception): ${error.message}`);
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { name, phone, address, bio, profileImage } = req.body;

        // Update fields
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        if (bio !== undefined) user.bio = bio;
        if (profileImage !== undefined) user.profileImage = profileImage;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change current user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect current password'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};
