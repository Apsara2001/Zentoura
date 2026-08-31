const User = require('./User');
const Blog = require('./Blog');
const Translation = require('./Translation');
const Hotel = require('./Hotel');
const Room = require('./Room');
const Booking = require('./Booking');
const Place = require('./Place');
const Activity = require('./Activity');
const Review = require('./Review');
const ActivityBooking = require('./ActivityBooking');
const Message = require('./Message');

// User - Blog associations
User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// User - Review associations
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Hotel - Review associations
Hotel.hasMany(Review, { foreignKey: 'hotelId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

// Hotel - Room associations
Hotel.hasMany(Room, { foreignKey: 'hotelId', as: 'rooms', onDelete: 'CASCADE' });
Room.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

// Booking relationships
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Hotel.hasMany(Booking, { foreignKey: 'hotelId', as: 'bookings' });
Booking.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

Room.hasMany(Booking, { foreignKey: 'roomId', as: 'bookings' });
Booking.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// Activity Booking relationships
User.hasMany(ActivityBooking, { foreignKey: 'userId', as: 'activityBookings' });
ActivityBooking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Activity.hasMany(ActivityBooking, { foreignKey: 'activityId', as: 'bookings' });
ActivityBooking.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });

// Place - Review associations
Place.hasMany(Review, { foreignKey: 'placeId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Place, { foreignKey: 'placeId', as: 'place' });

// Activity - Review associations
Activity.hasMany(Review, { foreignKey: 'activityId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });

// Blog - Review associations
Blog.hasMany(Review, { foreignKey: 'blogId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });

module.exports = {
    User,
    Blog,
    Translation,
    Hotel,
    Room,
    Booking,
    Place,
    Activity,
    ActivityBooking,
    Review,
    Message
};
