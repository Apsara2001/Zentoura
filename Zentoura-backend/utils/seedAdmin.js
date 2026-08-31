const { User } = require('../models');
const { connectDB } = require('../config/db');

const seedAdminUniversal = async () => {
    try {
        await connectDB();
        console.log('🔄 Connected to database...');

        // Explicitly sync the User model to ensure "isEmail" validation is truly gone
        await User.sync({ alter: true });
        console.log('✅ User model synchronized (alter: true)');

        // 1. Check/Create user with identifier 'admin'
        let admin = await User.findOne({ where: { email: 'admin' } });

        if (admin) {
            console.log(`🔄 User "admin" exists (ID: ${admin.id}). Updating password and role...`);
            admin.password = 'admin123';
            admin.role = 'admin';
            await admin.save();
            console.log('✅ User "admin" updated successfully');
        } else {
            console.log('🌱 Creating new user with identifier "admin"...');
            const newAdmin = await User.create({
                name: 'Zentoura Admin',
                email: 'admin',
                password: 'admin123',
                role: 'admin'
            });
            console.log(`✅ User "admin" created successfully with ID: ${newAdmin.id}`);
        }

        // 2. Ensure backup admin email exists
        let adminEmail = await User.findOne({ where: { email: 'admin@zentoura.com' } });
        if (!adminEmail) {
            await User.create({
                name: 'Zentoura Admin Email',
                email: 'admin@zentoura.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Backup admin@zentoura.com created');
        } else {
            console.log('✅ Backup admin@zentoura.com already exists');
        }

        console.log('✨ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdminUniversal();
