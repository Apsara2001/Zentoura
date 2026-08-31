const { Booking, ActivityBooking, User, Hotel } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
    try {
        // Helper to get last 7 days dates
        const getLast7Days = () => {
            const dates = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                dates.push(date.toISOString().split('T')[0]);
            }
            return dates;
        };

        const last7Days = getLast7Days();
        const startDate = new Date(last7Days[0]);
        const endDate = new Date(last7Days[6]);
        endDate.setHours(23, 59, 59, 999);

        // 1. Hotel Bookings Trend
        const hotelBookings = await Booking.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))]
        });

        // 2. Activity Bookings Trend
        const activityBookings = await ActivityBooking.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))]
        });

        // 3. User Registration Trend
        const newUsers = await User.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))]
        });

        // Process data to match last 7 days structure
        const formatData = (data, key = 'count') => {
            const dataMap = {};
            data.forEach(item => {
                const date = item.get('date');
                // Handle different potential return types from sequelize drivers
                const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
                dataMap[dateStr] = parseFloat(item.get(key)) || 0;
            });

            return last7Days.map(date => ({
                date,
                value: dataMap[date] || 0
            }));
        };

        const revenueData = last7Days.map(date => {
            const hotelRev = hotelBookings.find(hb => {
                const d = hb.get('date');
                return (typeof d === 'string' ? d : d.toISOString().split('T')[0]) === date;
            })?.get('revenue') || 0;

            const activityRev = activityBookings.find(ab => {
                const d = ab.get('date');
                return (typeof d === 'string' ? d : d.toISOString().split('T')[0]) === date;
            })?.get('revenue') || 0;

            return {
                date,
                value: parseFloat(hotelRev) + parseFloat(activityRev)
            };
        });

        res.json({
            success: true,
            data: {
                hotelBookings: formatData(hotelBookings, 'count'),
                activityBookings: formatData(activityBookings, 'count'),
                userRegistrations: formatData(newUsers, 'count'),
                revenue: revenueData
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats
};
